import "dotenv/config";
import express from "express";
import { Database } from "bun:sqlite";
import cors from "cors";

const db = new Database("db.sqlite");

// Init the sqlite table
db.run(
  `CREATE TABLE IF NOT EXISTS users
  ( id INT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP );`,
);

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

console.log("Hello via Bun!");

export { db };
