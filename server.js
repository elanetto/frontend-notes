import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000;

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Fallback route to serve index.html for the root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Initialize MySQL connection
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Logging middleware
let count = 0;
app.use((req, res, next) => {
  count++;
  console.log(`Request count: ${count}`);
  next();
});

// API Endpoints
app.get("/notes", async (req, res) => {
  const [result] = await connection.query(`
    SELECT 
      notes.id,
      notes.title, 
      notes.content, 
      notes.image, 
      notes.link, 
      user.name, 
      user.avatar 
    FROM notes
    JOIN user ON notes.user_id = user.id;
  `);
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

app.get("/notes/:id", async (req, res) => {
  const noteId = req.params.id;

  try {
    const [result] = await connection.query(
      `
      SELECT 
          notes.id, 
          notes.title, 
          notes.content, 
          notes.image, 
          notes.link, 
          user.name, 
          user.avatar 
      FROM notes 
      JOIN user ON notes.user_id = user.id 
      WHERE notes.id = ?;
      `,
      [noteId]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(result[0]);
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/notes/:id", authenticateToken, async (req, res) => {
  const noteId = req.params.id;
  const { title, content, image, link } = req.body;

  // Check for missing required fields
  if (!title || !content || !image || !link) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const userId = req.user.id; // Ensure the authenticated user owns the post
    const query = `
      UPDATE notes
      SET title = ?, content = ?, image = ?, link = ?
      WHERE id = ? AND user_id = ?;
    `;

    const [result] = await connection.query(query, [title, content, image, link, noteId, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Note not found or you do not have permission to edit this note" });
    }

    res.status(200).json({ message: "Note updated successfully" });
  } catch (err) {
    console.error("Error updating note:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// JWT authentication middleware
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Access denied, token missing" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = user;
    next();
  });
}

// Example protected route
app.get("/profile", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [results] = await connection.query(
      "SELECT name, email, avatar FROM user WHERE id = ?",
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      name: results[0].name,
      email: results[0].email,
      avatar: results[0].avatar,
    });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [rows] = await connection.query("SELECT * FROM user WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Error logging in:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

console.log(process.env.DB_HOST, process.env.DB_NAME);
