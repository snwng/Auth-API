import Database, { type Changes } from "bun:sqlite";
import type { User, NewUser } from "./types";
import config from "./config";

const db = new Database(config.DB_PATH);

// Init the sqlite table
db.run(
	`CREATE TABLE IF NOT EXISTS users
  ( id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  password TEXT NOT NULL,
  refreshToken TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP );`,
);

const byMail = db.prepare<User, string>("SELECT * FROM users WHERE email = ?");

const byId = db.prepare<User, number>("SELECT * FROM users WHERE id = ?");

const addUser = db.prepare<Changes, [string, string, string, string]>(
	"INSERT INTO users (email, firstName, lastName, password) VALUES (?, ?, ?, ?)",
);

const updateRT = db.prepare<Changes, [string | null, number]>(
	"UPDATE users SET refreshToken = ? WHERE id = ?",
);

class Users {
	static getByEmail(email: string): User | null {
		return byMail.get(email);
	}

	static getById(id: number): User | null {
		return byId.get(id);
	}

	static add(user: NewUser): Changes {
		const { email, firstName, lastName, password } = user;
		return addUser.run(email, firstName, lastName, password);
	}

	static updateRefreshToken(id: number, rt: string | null): Changes {
		return updateRT.run(rt, id);
	}
}

export { Users, db };
