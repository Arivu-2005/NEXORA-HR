import express from 'express';
import { getLeaves, applyLeave, updateLeaveStatus } from '../controllers/leaveController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getLeaves);
router.post('/', applyLeave);
router.put('/:id', authorize('Admin', 'HR', 'Manager'), updateLeaveStatus);

export default router;
