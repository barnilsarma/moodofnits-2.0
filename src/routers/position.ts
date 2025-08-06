import express from "express";
import * as Controllers from "../controllers";

const router = express.Router();

router.post("/", Controllers.Position.Create);
router.get("/:id", Controllers.Position.Read);
router.get("/", Controllers.Position.ReadAll);
export default router;
