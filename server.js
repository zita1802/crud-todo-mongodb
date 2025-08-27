const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require('body-parser');old
const cors = require("cors");

require("dotenv").config(); // at the top of server.js // in order to deploy

const path = require("path");

const app = express();
// app.use(bodyParser.json()); old
app.use(express.json());
app.use(cors());

// app.use(express.static('public'));// in order to deploy
app.use(express.static(path.join(__dirname, "public"))); // in order to deploy

// 1. Connect to MongoDB
//c1
// mongoose.connect('mongodb://localhost:27017/todo');

// ////c2
// mongoose.connect('mongodb://localhost:27017/todo')
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// //c3////////////////////////////////////
// async function connectDB() {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/todo");
//     console.log("MongoDB connected");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//     process.exit(1); // stop server if DB connection fails
//   }
// }

// connectDB();
// // ////////////////////////////////////
//c4
async function connectDB(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      //c1
      // await mongoose.connect("mongodb://localhost:27017/todo");
      //c2
      await mongoose.connect(process.env.MONGO_URI); //in order to deploy

      console.log("MongoDB connected");
      return; //Once the connection succeeds, we don’t need to continue the for loop or try again.
    } catch (err) {
      console.error("Retrying MongoDB connection...", err);
      await new Promise((res) => setTimeout(res, 2000)); // wait 2s
    }
  }
  console.error("MongoDB connection failed after retries");
  process.exit(1);
}

connectDB();

// 2. Task Schema
const taskSchema = new mongoose.Schema({
  text: String,
  done: Boolean,
});
const Task = mongoose.model("Task", taskSchema);

// 3. Routes

app.get("/", (req, res) => {
  res.send("✅ To-Do API is running! Use /tasks to interact with tasks.");
});

// Read all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Create a task
app.post("/tasks", async (req, res) => {
  const task = new Task({ text: req.body.text, done: false });
  await task.save();
  res.json(task);
});

// Update task
app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (req.body.text !== undefined) task.text = req.body.text;
  if (req.body.done !== undefined) task.done = req.body.done;
  await task.save();
  res.json(task);
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Start server
/////c1
// app.listen(3000, () => console.log("Server running on port 3000"));

/////c2 in order to deploy
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
