import express from "express";
import * as Controllers from "../controllers";
import { upload } from "src/utils/multerConfig";

const router = express.Router();

router.post("/", upload.single("photo"), Controllers.Post.Create);
router.get("/:id", Controllers.Post.Read);
router.get("/", Controllers.Post.ReadAll);
router.patch("/:id", Controllers.Post.Update);
export default router;
