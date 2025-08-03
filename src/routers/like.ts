import express from "express";
import * as Controllers from "../controllers";

const router = express.Router();

router.post("/:postId", Controllers.Like.likePost);

export default router;
