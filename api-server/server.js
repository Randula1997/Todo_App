const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/todo_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);

// Models
const Todo = require("./models/Todo");

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Error fetching todos" });
  }
});

app.post("/todo/new", async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Error creating todo" });
  }
});

app.delete("/todo/delete/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Error deleting todo" });
  }
});

app.get("/todo/complete/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.complete = !todo.complete;
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Error updating completion status" });
  }
});

app.put("/todo/update/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.text = req.body.text;
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Error updating todo" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
