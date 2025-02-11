import { Router } from "express";
import { signup, signin} from "../controllers/authController";
import { signinSchema } from "../schemas/auth/signinSchema";
import validateRequest from "../middlewares/validateRequest";
import { signupSchema } from "../schemas/auth/signupSchema";

const router = Router();

router.post("/signup", validateRequest(signupSchema), signup);
router.post("/signin", validateRequest(signinSchema), signin);

export default router;
