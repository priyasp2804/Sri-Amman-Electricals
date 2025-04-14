import express from "express";
import {
  getAllBrands,
  addBrand,
  updateBrand,
  deleteBrand
} from "../controllers/brandController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllBrands);
router.post("/add", protect, addBrand);
router.put("/edit/:id", protect, updateBrand);
router.delete("/delete/:id", protect, deleteBrand);

export default router;