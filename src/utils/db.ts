import Database from "bun:sqlite";
import type { User, NewUser } from "./interfaces";
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

const byMail = db.prepare<User, [string]>(
	"SELECT * FROM users WHERE email = ?",
);

const byId = db.prepare<User, [bigint]>("SELECT * FROM users WHERE id = ?");

const addUser = db.prepare<void, [string, string, string, string]>(
	"INSERT INTO users (email, firstName, lastName, password) VALUES (?, ?, ?, ?)",
);

const updateRT = db.prepare<void, [string | null, bigint]>(
	"UPDATE users SET refreshToken = ? WHERE id = ?",
);

class Users {
	static getByEmail(email: string): User | null {
		return byMail.get(email);
	}

	static getById(id: bigint): User | null {
		return byId.get(id);
	}

	static addUser(user: NewUser) {
		const { email, firstName, lastName, password } = user;
		return addUser.run(email, firstName, lastName, password);
	}

	static updateRefreshToken(id: bigint, refreshToken: string | null) {
		return updateRT.run(refreshToken, id);
	}
}

export { Users, db };
