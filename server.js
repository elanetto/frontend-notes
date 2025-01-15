import express from "express";
import cors from "cors";
import mysql from 'mysql2/promise';

const port = process.env.PORT || 3000;
console.log(port);

const connection = await mysql.createConnection({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

const app = express();

let count = 0;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    count++;
    console.log(count);
    next();
});

// Middleware
app.use(express.json()); // To parse JSON requests

app.get("/", async (req, res) => {
    const [result, fields] = await connection.query("SELECT * FROM notes");
    res.send(result);
});

app.post("/notes", async (req, res) => {
    const { title, content, image, link } = req.body;
  
    if (!title || !content || !image || !link) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    const query = "INSERT INTO notes (title, content, image, link) VALUES (?, ?, ?, ?)";
    try {
      const [results] = await connection.query(query, [title, content, image, link]);
      res.status(201).json({
        id: results.insertId,
        title,
        content,
        image,
        link,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
});
  
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
