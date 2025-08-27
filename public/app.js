const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const API = 'http://localhost:3000/tasks';

// Fetch all tasks
async function fetchTasks() {
  const res = await fetch(API);
  const tasks = await res.json();
  renderTasks(tasks);
}

// Render tasks
function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if(task.done) li.classList.add('done');

    li.addEventListener('click', () => toggleDone(task));
    li.addEventListener('dblclick', () => editTask(task));

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(task._id);
    });
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

// Add task
async function addTask() {
  const text = taskInput.value.trim();
  if(!text) return;
  await fetch(API, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text}) });
  taskInput.value = '';
  fetchTasks();
}

// Toggle done
async function toggleDone(task) {
  await fetch(`${API}/${task._id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({done: !task.done}) });
  fetchTasks();
}

// Edit task
async function editTask(task) {
  const newText = prompt('Edit task:', task.text);
  if(newText && newText.trim() !== '') {
    await fetch(`${API}/${task._id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text: newText.trim()}) });
    fetchTasks();
  }
}

// Delete task
async function deleteTask(id) {
  await fetch(`${API}/${id}`, { method:'DELETE' });
  fetchTasks();
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => { if(e.key==='Enter') addTask(); });

fetchTasks();

