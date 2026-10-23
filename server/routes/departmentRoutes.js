import express from 'express';
import { getDepartments, createDepartment, deleteDepartment } from '../controllers/departmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getDepartments);
router.post('/', authorize('Admin', 'HR'), createDepartment);
router.delete('/:id', authorize('Admin', 'HR'), deleteDepartment);

export default router;
