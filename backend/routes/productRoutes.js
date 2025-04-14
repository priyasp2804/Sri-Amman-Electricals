import express from 'express';
import {
  getProducts,
  getProductsByBrandAndCategory,
  getProductsByCategory,
  addProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getProducts);
router.get('/category/:category', protect, getProductsByCategory);
router.get('/:brand/:category', protect, getProductsByBrandAndCategory);
router.post('/add', protect, addProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;