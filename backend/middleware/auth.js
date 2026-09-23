import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../jwt_secret/config.js";

export function requireAuth(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Sign in to continue." });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const userId = Number(payload.userId ?? payload.id);
    if (!Number.isInteger(userId) || userId < 1) {
      return res.status(401).json({ message: "Your session is invalid. Sign in again." });
    }
    req.userId = userId;
    return next();
  } catch {
    return res.status(401).json({ message: "Your session has expired. Sign in again." });
  }
}
