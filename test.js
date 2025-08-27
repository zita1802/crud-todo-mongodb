
// GET all tasks


async function getTasks() {
  const res = await fetch('http://localhost:3000/tasks');
  const tasks = await res.json();
  console.log(tasks);
}

getTasks();


// POST new task
async function addTask() {
  const res = await fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Buy milk' })
  });
  const task = await res.json();
  console.log(task);
}

addTask();
