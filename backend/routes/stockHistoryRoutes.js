import express from "express";
import { getStockHistory } from "../controllers/stockHistoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getStockHistory);
router.get("/product/:productName", protect, getStockHistory);

export default router;