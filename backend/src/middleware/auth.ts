import { Response, NextFunction } from "express";
import { AuthRequest, UserRole } from "../types";
import { verifyToken } from "../utils/jwt";

/**
 * Verifies the JWT from the Authorization header and attaches
 * the decoded user (userId + role) to req.user.
 */
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Not authorized, no token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};

/**
 * Restricts a route to specific roles.
 * Usage: router.get("/admin-only", protect, restrictTo("admin"), handler)
 */
export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        message: "You do not have permission to perform this action",
      });
      return;
    }
    next();
  };
};
