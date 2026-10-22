import type jwt from "jsonwebtoken";
import type { userSchema, signUpSchema, tokenPayloadSchema } from "./validation";
import type * as z from "zod";

type User = z.infer< typeof userSchema>;
type NewUser = z.infer< typeof signUpSchema>;
type Tokenpayload = z.infer< typeof tokenPayloadSchema>;

declare global {
  namespace Express {
    interface Request {
      user?: Tokenpayload;
    }
  }
}

type ExpiresIn = jwt.SignOptions["expiresIn"];

export type { User, NewUser, Tokenpayload, ExpiresIn };
