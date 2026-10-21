import type jwt from "jsonwebtoken";

interface User {
  id: bigint;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  refreshToken: string | null;
  createdAt: string;
}

interface NewUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface Tokenpayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: Tokenpayload;
    }
  }
}

type ExpiresIn = jwt.SignOptions["expiresIn"];

export type { User, NewUser, Tokenpayload, ExpiresIn };
