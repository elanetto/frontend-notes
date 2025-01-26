import express from "express";
import cors from "cors";
import mysql from 'mysql2/promise';
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// const jwt = require('jsonwebtoken')

dotenv.config();

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

app.get("/notes", async (req, res) => {
  const [result, fields] = await connection.query(`
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

      res.json(result[0]); // Return the first (and only) result
  } catch (err) {
      console.error("Database error:", err.message);
      res.status(500).json({ error: "Internal server error" });
  }
});

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


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
  }

  try {
      // Retrieve the user by email
      const [rows] = await connection.query("SELECT * FROM user WHERE email = ?", [email]);

      if (rows.length === 0) {
          return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = rows[0];

      // Compare the entered password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate a JWT token
      const accessToken = jwt.sign(
          { id: user.id, email: user.email, name: user.name },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '1h' }
      );

      res.status(200).json({
          message: "Login successful",
          token: accessToken,
          user: {
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.avatar
          }
      });
  } catch (err) {
      console.error("Error logging in:", err.message);
      res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
  }

  try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const avatars = [
          "https://raw.githubusercontent.com/elanetto/frontend-notes/cafee02253905415b4e5f0b1730884f4b3d2b64c/assets/images/avatar/avatar-01.svg",
          "https://raw.githubusercontent.com/elanetto/frontend-notes/cafee02253905415b4e5f0b1730884f4b3d2b64c/assets/images/avatar/avatar-02.svg",
          "https://raw.githubusercontent.com/elanetto/frontend-notes/cafee02253905415b4e5f0b1730884f4b3d2b64c/assets/images/avatar/avatar-03.svg",
          "https://raw.githubusercontent.com/elanetto/frontend-notes/cafee02253905415b4e5f0b1730884f4b3d2b64c/assets/images/avatar/avatar-04.svg"
      ];

      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

      const query = "INSERT INTO user (name, email, password, avatar) VALUES (?, ?, ?, ?)";
      await connection.query(query, [name, email, hashedPassword, randomAvatar]);

      res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
      console.error("Registration error:", err.message);
      res.status(500).json({ error: "Internal server error" });
  }
});


function authenticateToken(req, res, next){
  const token = req.headers['authorization'].split(" ")[1];
  
  if (!token) {
      return res.status(403).json({ error: "Access denied, token missing" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid token" });

      req.user = user;
      next();
  });
};


app.get("/profile", authenticateToken, (req, res) => {
  const userId = req.user.id;
  connection.query(
      "SELECT id, name, email, avatar FROM user WHERE id = ?",
      [userId],
      (error, results) => {
          if (error) {
              console.error("Database error:", error);
              return res.status(500).json({ error: "Internal server error" });
          }
          if (results.length === 0) {
              return res.status(404).json({ error: "User not found" });
          }
          console.log("Fetched user data:", results[0]);
          res.json({ user: results[0] });
      }
  );
});

app.put("/notes/:id", authenticateToken, (req, res) => {
  const noteId = req.params.id;
  const { title, content } = req.body;

  // Check if title and content are provided
  if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
  }

  const userId = req.user.id;
  const query = `UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?`;
  
  connection.query(query, [title, content, noteId, userId], (error, results) => {
      if (error) {
          console.error("Database error:", error);
          return res.status(500).json({ error: "Internal server error" });
      }
      
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Note not found or you do not have permission to edit this note" });
      }

      console.log("Updated note:", results);
      // Send an explicit 200 status code for success
      res.status(200).json({ message: "Note updated successfully" });
  });
});


// Endpoint to delete a specific note
app.delete("/notes/:id", authenticateToken, (req, res) => {
  const noteId = req.params.id; // Get the note ID from the request parameters
  const userId = req.user.id; // Get the user ID from the authenticated user

  // SQL query to delete the note
  connection.query(
    "DELETE FROM notes WHERE id = ? AND user_id = ?",
    [noteId, userId],
    (error, results) => {
      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Note not found or you do not have permission to delete this note" });
      }

      console.log("Deleted note ID:", noteId);
      res.json({ message: "Note deleted successfully" });
    }
  );
});
  
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

console.log(process.env.DB_HOST, process.env.DB_NAME);