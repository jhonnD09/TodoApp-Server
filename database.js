import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

const pool = mysql
  .createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
  })
  .promise();

export const getTodo = async (id) => {
  const [row] = await pool.query(`SELECT * FROM todos WHERE id = ?`, [id]);

  return row[0];
};

export const getTodosById = async (id) => {
  const [rows] = await pool.query(
    `SELECT todos.*, shared_todos.shared_with_id
  FROM todos
  LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
  WHERE todos.user_id = ? OR shared_todos.shared_with_id = ?
  `,
    [id, id]
  );

  return rows;
};

export const getSharedTodoById = async (id) => {
  const [rows] = await pool.query(
    `SELECT * FROM shared_todos WHERE todo_id = ?`,
    [id]
  );
  return rows[0];
};

export const getUserById = async (id) => {
  const [user] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return user[0];
};

export const getUserByEmail = async (id) => {
  const [email] = await pool.query(`SELECT * FROM users WHERE email = ?`, [id]);
  return email[0];
};

export const createTodo = async (user_id, title) => {
  const result = pool.query(
    `INSERT INTO todos (user_id, title) VALUES (?, ?)`,
    [user_id, title]
  );
  const todoId = result.insertId;
  return getTodo(todoId);
};

export const deleteTodoById = async (id) => {
  const [result] = pool.query(`DELETE FROM todos WHERE id = ?`, [id]);
  return result;
};

export const toggleCompleted = async (id, value) => {
  const newValue = value === true ? 1 : 0;
  const [result] = pool.query(
    `UPDATE todos
    SET completed = ${newValue}
    WHERE id = ?
    `,
    [id]
  );
  console.log(result);
  return result;
};

export const shareTodo = async (todo_id, user_id, shared_with_id) => {
  const [result] = await pool.query(
    `
    INSERT INTO share_todos (todo_id, user_id, shared_with_id)
    VALUES (?,?,?)
    `,
    [todo_id, user_id, shared_with_id]
  );
  return result.insertId;
};
