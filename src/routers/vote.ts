import express from "express";
import * as Controllers from "../controllers";

const router = express.Router();

router.post("/", Controllers.Vote.voteSingle);
router.patch("/", Controllers.Vote.updateVote);
router.get("/", Controllers.Vote.readPositionVotes);
export default router;
