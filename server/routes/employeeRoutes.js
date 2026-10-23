import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All employee routes require authentication

router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', authorize('Admin', 'HR'), createEmployee);
router.put('/:id', authorize('Admin', 'HR', 'Manager'), updateEmployee);
router.delete('/:id', authorize('Admin', 'HR'), deleteEmployee);

export default router;
