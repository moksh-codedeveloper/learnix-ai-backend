import Router from "express";
import { registerUser, loginUser, logout } from "../controllers/user.controllers.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("logout", logout);
export default router;