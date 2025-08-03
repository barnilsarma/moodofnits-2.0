import express from "express";
import * as Controllers from "../controllers";

const router = express.Router();

router.post("/", Controllers.Comment.createComment);
router.get("/:postId", Controllers.Comment.readAllComments);
router.delete("/:id", Controllers.Comment.deleteComment);
export default router;
