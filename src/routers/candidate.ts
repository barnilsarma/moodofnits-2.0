import express from "express";
import * as Controllers from "../controllers";
import { upload } from "src/utils/multerConfig";

const router = express.Router();

router.post("/", upload.single("candidatePhoto"), Controllers.Candidate.Create);
router.get("/:id", Controllers.Candidate.Read);
router.get("/", Controllers.Candidate.ReadAll);

export default router;
