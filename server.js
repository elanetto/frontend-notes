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

// app.get("/", async (req, res) => {
//     const [result, fields] = await connection.query("SELECT * FROM notes");
//     res.send(result);
// });

app.get("/notes", async (req, res) => {
  const [result, fields] = await connection.query(`
  SELECT notes.title, notes.content, notes.image, notes.link, 
  user.name, user.avatar from notes
  join user on notes.user_id = user.id;
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

app.get("/user", async (req, res) => {
  const { email } = req.query;  // Use query parameters

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = `SELECT * FROM user WHERE email = ?`;
  
  try {
    console.log("Executing query:", query, "with email:", email);  // Debugging
    const [results] = await connection.query(query, [email]);

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(results[0]);  // Return the first user found
  } catch (err) {
    console.error("Database error:", err.message);
    return res.status(500).json({ error: err.message });
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
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Define available avatars
      const avatars = [
          "./assets/images/avatar/avatar-01.svg",
          "./assets/images/avatar/avatar-02.svg",
          "./assets/images/avatar/avatar-03.svg",
          "./assets/images/avatar/avatar-04.svg"
      ];

      // Select a random avatar
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

      // Insert user into the database
      const query = "INSERT INTO user (name, email, password, avatar) VALUES (?, ?, ?, ?)";
      await connection.query(query, [name, email, hashedPassword, randomAvatar]);

      res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
      console.error("Registration error:", err.message);
      res.status(500).json({ error: "Internal server error" });
  }
});




const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
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
          console.log("Fetched user data:", results[0]); // Debugging
          res.json({ user: results[0] });
      }
  );
});


  
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

console.log(process.env.DB_HOST, process.env.DB_NAME);