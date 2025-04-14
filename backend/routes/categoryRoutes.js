import express from "express";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoriesByBrand
} from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCategories);
router.get("/brand/:brand", protect, getCategoriesByBrand);
router.post("/add", protect, addCategory);
router.put("/edit/:id", protect, updateCategory);
router.delete("/delete/:id", protect, deleteCategory);

export default router;