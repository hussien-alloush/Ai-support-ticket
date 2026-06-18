import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { AppError } from "../middleware/errorHandler";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("A user with this email already exists", 409);
    }

    // Only allow "customer" or "agent" at signup — "admin" should be
    // assigned manually in the database, never through public signup.
    const safeRole = role === "agent" ? "agent" : "customer";

    const user = await User.create({ name, email, password, role: safeRole });

    const token = signToken({ userId: user.id, role: user.role });

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = signToken({ userId: user.id, role: user.role });

    res.status(200).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};
