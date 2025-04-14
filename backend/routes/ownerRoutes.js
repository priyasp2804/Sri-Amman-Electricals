import express from "express";
import { registerOwner, loginOwner, checkOwnerExists } from "../controllers/ownerController.js";

const router = express.Router();

router.get("/owner-exists", checkOwnerExists);
router.post("/register", registerOwner);
router.post("/login", loginOwner);

export default router;
