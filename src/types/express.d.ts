import type { JwtPayload } from "jsonwebtoken";
import type { Tokenpayload } from "../utils/interfaces";

declare global {
  namespace Express {
    interface Request {
      user?: Tokenpayload;
    }
  }
}
