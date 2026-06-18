import { Router } from "express";
import { register, login } from "../controllers/authController";
import { registerValidation, loginValidation, validate } from "../middleware/validators";

const router = Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);

export default router;
