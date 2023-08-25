CREATE DATABASE todo_tu;
USE todo_tu;

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255)
);
CREATE TABLE todos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    completed BOOLEAN DEFAULT false,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE shared_todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    todo_id INT,
    user_id INT,
    shared_with_id INT,
    FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_with_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Isert two users into the users table
INSERT INTO users (name, email, password) VALUES ('Alberto', 'Alberto@gmail.com,', 'password1');
INSERT INTO users (name, email, password) VALUES ('Luis', 'Luis@gmail.com,', 'password2');

--+----+---------+--------------------+-----------+
--| id | name    | email              | password  |
--+----+---------+--------------------+-----------+
--|  1 | Alberto | Alberto@gmail.com, | password1 |
--|  2 | Luis    | Luis@gmail.com,    | password2 |
--+----+---------+--------------------+-----------+

 SELECT * FROM users WHERE id = 1;

--+----+---------+--------------------+-----------+
--| id | name    | email              | password  |
--+----+---------+--------------------+-----------+
--|  1 | Alberto | Alberto@gmail.com, | password1 |
--+----+---------+--------------------+-----------+

INSERT INTO todos (title, user_id) VALUES 
('🏃Go for a morning run🌅', 1),
('💻Work on project presentation🏢', 1),
('🛍️Go grocery shoping🛒', 1),
('📚Read 30 pages of book📖', 1),
('🚲Ride bike to the park⛲', 1),
('🍽️Cook dinner for family🍳', 1),
('🧘🏽‍♂️Practice  yoga🧘🏽', 1),
('👂🏽Listen to a podcast', 1),
('🧹Clean the house🧹', 1),
('🛌🏽Get 8 hour of sleep💤', 1);

DESCRIBE shared_todos;

--+----------------+------+------+-----+---------+----------------+
--| Field          | Type | Null | Key | Default | Extra          |
--+----------------+------+------+-----+---------+----------------+
--| id             | int  | NO   | PRI | NULL    | auto_increment |
--| todo_id        | int  | YES  | MUL | NULL    |                |
--| user_id        | int  | YES  | MUL | NULL    |                |
--| shared_with_id | int  | YES  | MUL | NULL    |                |
--+----------------+------+------+-----+---------+----------------+

INSERT INTO shared_todos (todo_id, user_id, shared_with_id) VALUES (1,1,2)

SELECT * FROM shared_todos;
--+----+---------+---------+----------------+
--| id | todo_id | user_id | shared_with_id |
--+----+---------+---------+----------------+
--|  1 |       1 |       1 |              2 |
--+----+---------+---------+----------------+

SELECT todos.*, shared_todos.shared_with_id 
FROM todos
LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
WHERE todos.user_id = [user_id] OR shared_todos.shared_with_id = [user_id]

SELECT todos.*, shared_todos.shared_with_id
FROM todos
LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
WHERE todos.user_id = 2 OR shared_todos.shared_with_id = 2;

--+----+------------------------------+-----------+---------+----------------+
--| id | title                        | completed | user_id | shared_with_id |
--+----+------------------------------+-----------+---------+----------------+
--|  1 | 🏃Go for a morning run🌅    |         0 |       1 |         2      |
--+----+------------------------------+-----------+---------+----------------+
