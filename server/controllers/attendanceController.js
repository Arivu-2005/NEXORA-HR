import Attendance from '../models/Attendance.js';
import { checkDatabaseStatus } from '../config/db.js';
import { mockAttendance } from '../config/initialData.js';

let attendanceList = [...mockAttendance];

export const getAttendance = async (req, res) => {
  try {
    if (checkDatabaseStatus()) {
      let query = {};
      if (req.user.role === 'Employee') {
        query.user = req.user.id;
      }
      const records = await Attendance.find(query).sort({ date: -1 });
      return res.status(200).json({ success: true, count: records.length, data: records });
    }

    res.status(200).json({ success: true, count: attendanceList.length, data: attendanceList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkIn = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (checkDatabaseStatus()) {
      let record = await Attendance.findOne({ user: req.user.id, date: today });
      if (record && record.checkIn) {
        return res.status(400).json({ success: false, message: 'You have already checked in today.' });
      }
      if (!record) {
        record = await Attendance.create({
          user: req.user.id,
          userName: req.user.name,
          date: today,
          checkIn: nowTime,
          status: 'Present',
          notes: req.body.notes || 'Shift Clock-in'
        });
      } else {
        record.checkIn = nowTime;
        await record.save();
      }
      return res.status(200).json({ success: true, message: 'Checked in successfully', data: record });
    }

    // In-memory fallback
    const newRecord = {
      _id: 'att_' + Date.now(),
      user: req.user?.id || 'usr_emp',
      userName: req.user?.name || 'Alexander Wright',
      date: today,
      checkIn: nowTime,
      checkOut: null,
      status: 'Present',
      workHours: 0,
      notes: req.body.notes || 'Shift Clock-in'
    };
    attendanceList.unshift(newRecord);
    res.status(200).json({ success: true, message: 'Checked in successfully', data: newRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (checkDatabaseStatus()) {
      const record = await Attendance.findOne({ user: req.user.id, date: today });
      if (record) {
        record.checkOut = nowTime;
        record.workHours = 8.5;
        await record.save();
        return res.status(200).json({ success: true, message: 'Checked out successfully', data: record });
      }
    }

    if (attendanceList.length > 0) {
      attendanceList[0].checkOut = nowTime;
      attendanceList[0].workHours = 8.5;
      return res.status(200).json({ success: true, message: 'Checked out successfully', data: attendanceList[0] });
    }

    res.status(200).json({ success: true, message: 'Checked out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
