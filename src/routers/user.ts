import express from "express";
import * as Controllers from "../controllers";

const router = express.Router();

router.post("/", Controllers.User.createUser);
router.get("/", Controllers.User.readUser);

export default router;
