import express from "express";
import {
  getTodo,
  getTodosById,
  getSharedTodoById,
  getUserById,
  getUserByEmail,
  createTodo,
  deleteTodoById,
  toggleCompleted,
  shareTodo,
} from "./database.js";
import morgan from "morgan";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
// const corsOption = {
//   origin: "http://192.168.1.100:8081",
//   methods: ["POST", "GET"],
//   credentials: true,
// };

app.use(cors());

app.get("/todos/:id", async (req, res) => {
  try {
    const todos = await getTodosById(req.params.id);
    res.status(200).send(todos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/todos/shared_todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await getSharedTodoById(id);
    const author = await getUserById(todo?.user_id);
    const shared_with = await getUserById(todo?.shared_with_id);
    res.status(200).json({ author, shared_with });
    // console.log(shared_with);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/todos/:id", async (req, res) => {
  const { value } = req.body;
  const { id } = req.params;
  try {
    const todo = await toggleCompleted(id, value);
    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteTodoById(id);
    res.status(200).send("Todo deleted successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/todos/shared_todos", async (req, res) => {
  const { todo_id, user_id, email } = req.body;
  console.log({ todo_id, user_id, email });
  try {
    const userToShare = await getUserByEmail(email);
    const sharedTodo = await shareTodo(todo_id, user_id, userToShare.id);
    res.status(201).json(sharedTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/todos", async (req, res) => {
  const { user_id, title } = req.body;
  console.log(user_id, title);
  try {
    const newTodo = await createTodo(user_id, title);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(8080, () => {
  console.log("Server running on PORT 8080");
});
