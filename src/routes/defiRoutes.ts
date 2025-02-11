import { Router } from "express";
import {getAllDefis, updateDefiHistory} from "../controllers/defiController";

const router = Router();

router.put("/", updateDefiHistory);
router.get("/", getAllDefis);

export default router;