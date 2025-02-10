import { Router } from "express";
import { signup, signin, sendCode, checkCode } from "../controllers/authController";
import { signinSchema } from "../schemas/auth/signinSchema";
import validateRequest from "../middlewares/validateRequest";
import { signupSchema } from "../schemas/auth/signupSchema";
import { sendCodeSchema } from "../schemas/auth/sendCodeSchema";
import { checkCodeSchema } from "../schemas/auth/checkCodeSchema";

const router = Router();

router.post("/signup", validateRequest(signupSchema), signup);
router.post("/signin", validateRequest(signinSchema), signin);
router.post("/sendCode", validateRequest(sendCodeSchema),sendCode);
router.post("/checkCode", validateRequest(checkCodeSchema),checkCode);

export default router;
