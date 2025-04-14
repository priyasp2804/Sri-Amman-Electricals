// report.routes.js
import express from 'express';
import { 
  generateReport,
  getBrands,
  getCategories,
  getProducts
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/brands', protect, getBrands);
router.get('/categories', protect, getCategories);
router.get('/products', protect, getProducts);
router.post('/generate', protect, generateReport);

export default router;