import Attendance from '../models/Attendance.js';

// @desc    Get attendance records (Filtered by user or all for Admin/HR)
// @route   GET /api/attendance
export const getAttendance = async (req, res) => {
  try {
    let query = {};
    // If not Admin or HR, only allow viewing own attendance
    if (req.user.role === 'Employee') {
      query.user = req.user.id;
    } else if (req.query.userId) {
      query.user = req.query.userId;
    }

    if (req.query.date) {
      query.date = req.query.date;
    }

    const records = await Attendance.find(query).sort({ date: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clock in
// @route   POST /api/attendance/check-in
export const checkIn = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let record = await Attendance.findOne({ user: req.user.id, date: today });
    if (record && record.checkIn) {
      return res.status(400).json({ success: false, message: 'You have already checked in today.' });
    }

    // Determine status (e.g. check if after 9:30 AM = Late)
    const currentHour = new Date().getHours();
    const status = currentHour >= 10 ? 'Late' : 'Present';

    if (!record) {
      record = await Attendance.create({
        user: req.user.id,
        userName: req.user.name,
        date: today,
        checkIn: nowTime,
        status: status,
        notes: req.body.notes || 'Regular Clock-in'
      });
    } else {
      record.checkIn = nowTime;
      record.status = status;
      await record.save();
    }

    res.status(200).json({ success: true, message: 'Checked in successfully', data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clock out
// @route   POST /api/attendance/check-out
export const checkOut = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const record = await Attendance.findOne({ user: req.user.id, date: today });
    if (!record || !record.checkIn) {
      return res.status(400).json({ success: false, message: 'Please check in first before checking out.' });
    }

    record.checkOut = nowTime;
    record.workHours = 8.5; // Calculated or standard shift
    await record.save();

    res.status(200).json({ success: true, message: 'Checked out successfully', data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
