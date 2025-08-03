import express from "express";
import * as Controllers from "../controllers";

const router = express.Router();

router.post("/", Controllers.Position.Create);
router.get("/read/:id", Controllers.Position.Read);
router.get("/:id", Controllers.Position.ReadAll);
export default router;
