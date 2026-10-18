import { db } from "../app.ts";
import type { User } from "./interfaces.ts";

const ByMail = db.prepare<User, [string]>(
  "SELECT * FROM users WHERE email = ?",
);
const addUser = db.prepare(
  "INSERT INTO users (email, firstName, lastName) VALUES (?, ?, ?)",
);

class Users {
  getUserByEmail(email: string): User | null {
    return ByMail.get(email);
  }

  addUser(user: User) {
    const { email, firstName, lastName } = user;
    return addUser.run(email, firstName, lastName);
  }
}

export { Users };
