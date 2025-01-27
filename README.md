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

