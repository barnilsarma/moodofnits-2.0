import express from "express";
import * as Controllers from "../controllers";

const router = express.Router();

router.post("/", Controllers.ExitPoll.Create);
router.get("/", Controllers.ExitPoll.ReadAll);

export default router;
