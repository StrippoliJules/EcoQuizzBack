import { Router } from "express";
import validateRequest from "../middlewares/validateRequest";
import { deleteUser, editPassword, editUser, forgotPassword, getUser, getUsers, resetPassword } from "../controllers/userController";
import { editUserSchema } from "../schemas/user/editUserSchema";
import { editPasswordSchema } from "../schemas/user/editPasswordSchema";
import authMiddleware from "../middlewares/authMiddleware";
import { resetPasswordSchema } from "../schemas/user/resetPasswordSchema";
import { forgotPasswordSchema } from "../schemas/user/forgotPasswordSchema";

const router = Router();

router.patch("/edit", validateRequest(editUserSchema), authMiddleware, editUser);
router.patch("/editPassword", validateRequest(editPasswordSchema), authMiddleware, editPassword);
router.post("/forgotPassword", validateRequest(forgotPasswordSchema), forgotPassword);
router.post("/resetPassword", validateRequest(resetPasswordSchema), resetPassword);
router.delete("/delete", authMiddleware, deleteUser);
router.get("/:id", authMiddleware, getUser);
router.get("/", authMiddleware, getUsers);

export default router;