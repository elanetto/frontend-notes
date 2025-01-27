# Frontend Notes

A full-stack project built with Node.js, Express, MySQL, and Tailwind CSS to manage and display notes.

## Features
- User authentication (login, register)
- Create, read, update, and delete notes
- Responsive design using Tailwind CSS
- Backend API connected to a MySQL database

---

## Prerequisites
To set up and run this project, you will need:
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **MySQL** server (or any compatible MySQL hosting provider)

---

## Getting Started

### Step 1: Fork and Clone the Repository
1. Click the **Fork** button on this repository to create your own copy.
2. Clone the repository to your local machine:
```bash
   git clone https://github.com/your-username/frontend-notes.git
```

3. Navigate into the project directory:
  ```bash
cd frontend-notes
  ```

### Step 2: Install Dependencies
Install all required Node.js dependencies:
  ```bash
npm install
  ```

### Step 3: Set Up MySQL Database
1. Create a MySQL Database:
- Open your MySQL client and create a database for this project.
- Example SQL command:
```bash
CREATE DATABASE frontend_notes;
  ```

2. Create Required Tables:
- Import the schema.sql file provided in the project to create the necessary tables.
- Example (from MySQL CLI):
```bash
mysql -u your_username -p frontend_notes < schema.sql
  ```

### Step 4: Configure Environment Variables
Create a .env file in the root of the project and add your MySQL credentials:
```bash
DB_HOST=your-database-host
DB_NAME=frontend_notes
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_PORT=3306

ACCESS_TOKEN_SECRET=your-secret-key
  ```

Replace your-database-host, your-database-username, and your-database-password with your actual MySQL credentials. Generate a secure ACCESS_TOKEN_SECRET using any random string generator.

### Step 5: Build Tailwind CSS
To build and watch the Tailwind CSS styles, run the following:
```bash
npx tailwindcss -i ./src/css/input.css -o ./src/css/output.css --watch
  ```

### Step 6: Run the Project
To start both the server and Tailwind CSS watcher, use the following command:
```bash
npm start
  ```
This will:
- Start the server (Node.js backend)
- Watch for Tailwind CSS changes and rebuild styles

----

## Access the Application
Once the project is running, you can access it at:
```bash
http://localhost:3000
  ```

---

## Deployment
This project is deployed as a Web Service and a PostgreSQL (converting mySQL into an API) using Render.

---

# API Documentation
### Base URL
- For local development: http://localhost:3000
- For deployment: Replace the base URL with your deployed backend URL

## Endpoints
### 1. User Authentication

Login (login with excisting user)
- Endpoint: /login
- Method: POST
- Headers: Content-Type: application/json
- Request Body:
```bash
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```bash
{
  "message": "Login successful",
  "token": "jwt-token-goes-here",
  "user": {
    "id": 1,
    "name": "Donald Duck",
    "email": "user@example.com",
    "avatar": "https://example.com/avatar.png"
  }
}
```

Profile (Fetch and read information about excisitng user)
- Endpoint: /profile
- Method: GET
- Headers:
- Content-Type: application/json
- Authorization: Bearer <jwt-token>

Response:
```bash
{
  "name": "John Doe",
  "email": "user@example.com",
  "avatar": "https://example.com/avatar.png"
}
```

### 2. Notes

Get All Notes
- Endpoint: /notes
- Method: GET

Response:
```bash
[
  {
    "id": 1,
    "title": "First Note",
    "content": "This is the content of the note.",
    "image": "https://example.com/note-image.jpg",
    "link": "https://notion.so/example",
    "name": "Donald Duck",
    "avatar": "https://example.com/avatar.png"
  }
]
```
PS: 'image' here refers to the image saved to the note. Name and avatar refers to the user who made the note.

Get a Note by ID
- Endpoint: /notes/:id
- Method: GET

Response:
```bash
{
  "id": 1,
  "title": "First Note",
  "content": "This is the content of the note.",
  "image": "https://example.com/note-image.jpg",
  "link": "https://notion.so/example",
  "name": "Donald Duck",
  "avatar": "https://example.com/avatar.png"
}
```

Create a New Note
- Endpoint: /notes
- Method: POST
- Headers:
      - Content-Type: application/json
      - Authorization: Bearer <jwt-token>

Request Body:
```bash
{
  "title": "New Note",
  "content": "This is the content of the new note.",
  "image": "https://example.com/new-note-image.jpg",
  "link": "https://notion.so/new-note",
  "user_id": 1
}
```

Response:
```bash

{
  "id": 2,
  "title": "New Note",
  "content": "This is the content of the new note.",
  "image": "https://example.com/new-note-image.jpg",
  "link": "https://notion.so/new-note",
  "user_id": 1
}
```

Update a Note
- Endpoint: /notes/:id
- Method: PUT
- Headers:
- Content-Type: application/json
- Authorization: Bearer <jwt-token>

Request Body:
```bash
{
  "title": "Updated Note",
  "content": "This is the updated content.",
  "image": "https://example.com/updated-note-image.jpg",
  "link": "https://notion.so/updated-note"
}
```

Delete a Note
- Endpoint: /notes/:id
- Method: DELETE
- Headers:
      - Content-Type: application/json
      - Authorization: Bearer <jwt-token>

Response:
- Success (200):
```bash
{
  "message": "Note deleted successfully"
}
```

- Error (404):
```bash
{
  "error": "Note not found or you do not have permission to delete this note"
}
```
