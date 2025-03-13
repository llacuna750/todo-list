const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Use CORS with allowed origins
app.use(cors({
    origin: ['https://llacuna750.github.io', 'http://localhost:5173'],  // Allow both local and production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("✅ Connected to MySQL database");
});

// Get all tasks
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      res.status(500).json({ error: "Error fetching tasks" });
      return;
    }
    console.log("Tasks retrieved:", results);
    res.json(results);
  });
});


// Add a new task
app.post("/api/tasks", (req, res) => {
    const { text } = req.body;
    db.query("INSERT INTO tasks (text) VALUES (?)", [text], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, text });
    });
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
        if (err) throw err;
        res.sendStatus(204);
    });
});

// Update a task
app.put("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    db.query("UPDATE tasks SET text = ? WHERE id = ?", [text, id], (err) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

// Start server
const PORT = process.env.VITE_PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
