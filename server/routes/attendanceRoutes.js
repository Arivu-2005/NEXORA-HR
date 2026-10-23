import express from 'express';
import { getAttendance, checkIn, checkOut } from '../controllers/attendanceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getAttendance);
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);

export default router;
