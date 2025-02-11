import { Router } from "express";
import {getAllDefis, getDefiLatestTimesController, updateDefiHistory} from "../controllers/defiController";

const router = Router();

router.put("/", updateDefiHistory);
router.get("/", getAllDefis);
router.post("/lastTimeDone", getDefiLatestTimesController)

export default router;