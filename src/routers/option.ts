import express from "express";
import * as Controllers from "../controllers";

const router = express.Router();

router.post("/", Controllers.Option.Create);
router.get("/readAll/:postId", Controllers.Option.ReadAll);
router.get("/read/:id", Controllers.Option.Read);
export default router;
