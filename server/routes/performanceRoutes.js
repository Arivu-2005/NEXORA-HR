import express from 'express';
import {
  getPerformance,
  createPerformanceReview,
  updatePerformanceReview
} from '../controllers/performanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getPerformance);
router.post('/', authorize('Admin', 'HR', 'Manager'), createPerformanceReview);
router.put('/:id', authorize('Admin', 'HR', 'Manager'), updatePerformanceReview);

export default router;
