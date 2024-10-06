const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const readFileAsync = async (filePath) => {
    try {
      const data = await fs.promises.readFile(filePath, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading file:", err);
      throw err;
    }
  };
  
  const writeFileAsync = async (filePath, data) => {
    try {
      await fs.promises.writeFile(filePath, data, "utf-8");
      return true;
    } catch (err) {
      console.error("Error writing file:", err);
      throw err;
    }
  };

app.set("view engine", "ejs");
app.set("views", path.join("C:/Users/WanoPc/Documents/code/java/todo/todo_express/views"));
app.get("/", async (req, res) => {
  try {
    const tasks = await readFileAsync("./tasks.json");
    res.render("index", { tasks: tasks, error: null });
  } catch (err) {
    res.status(500).send("Unable to load tasks.");
  }
});

app.use(express.urlencoded({ extended: true }));
app.post("/", async (req, res) => {
  let error = null;
  if (req.body.task.trim().length === 0) {
    error = "Task cannot be empty";
    const tasks = await readFileAsync("./tasks.json");
    res.render("index", { tasks: tasks, error: error });
  } else {
    try {
      const tasks = await readFileAsync("./tasks.json");
      const newTaskId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 0;
      const newTask = { id: newTaskId, task: req.body.task };
      tasks.push(newTask);
      await writeFileAsync("./tasks.json", JSON.stringify(tasks, null, 2));
      res.redirect("/");
    } catch (err) {
      res.status(500).send("Unable to add task :(.");
    }
  }
});

app.get("/delete-task/:taskId", async (req, res) => {
  const taskId = parseInt(req.params.taskId);
  try {
    const tasks = await readFileAsync("./tasks.json");
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    await writeFileAsync("./tasks.json", JSON.stringify(updatedTasks, null, 2));
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Unable to delete task.");
  }
});

app.get("/update-task/:taskId", async (req, res) => {
  const taskId = parseInt(req.params.taskId);
  try {
    const tasks = await readFileAsync("./tasks.json");
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      res.render("update-task", { task: taskToEdit, error: null });
    } else {
      res.status(404).send("Task not found");
    }
  } catch (err) {
    res.status(500).send("Unable to load task for update.");
  }
});

app.post("/update-task/:taskId", async (req, res) => {
  const taskId = parseInt(req.params.taskId);
  let error = null;

  if (req.body.task.trim().length === 0) {
    error = "Update Task cannot be empty";
    const tasks = await readFileAsync("./tasks.json");
    const taskToEdit = tasks.find(task => task.id === taskId);
    res.render("update-task", { task: taskToEdit, error: error });
  } else {
    try {
      const tasks = await readFileAsync("./tasks.json");
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (taskToUpdate) {
        taskToUpdate.task = req.body.task;
        await writeFileAsync("./tasks.json", JSON.stringify(tasks, null, 2));
        res.redirect("/");
      } else {
        res.status(404).send("Task not found");
      }
    } catch (err) {
      res.status(500).send("Unable to update task.");
    }
  }
});

app.get("/delete-all-tasks", async (req, res) => {
  try {
    await writeFileAsync("./tasks.json", JSON.stringify([], null, 2));
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Unable to delete all tasks.");
  }
});

app.listen(3001, () => {
  console.log("Server started on http://localhost:3001");
});
