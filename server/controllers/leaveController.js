import LeaveRequest from '../models/LeaveRequest.js';
import { checkDatabaseStatus } from '../config/db.js';
import { mockLeaves } from '../config/initialData.js';

let leavesData = [...mockLeaves];

export const getLeaves = async (req, res) => {
  try {
    if (checkDatabaseStatus()) {
      let query = {};
      if (req.user.role === 'Employee') query.user = req.user.id;
      const leaves = await LeaveRequest.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: leaves.length, data: leaves });
    }

    res.status(200).json({ success: true, count: leavesData.length, data: leavesData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const applyLeave = async (req, res) => {
  try {
    if (checkDatabaseStatus()) {
      const leave = await LeaveRequest.create({
        user: req.user.id,
        userName: req.user.name,
        ...req.body,
        status: 'Pending'
      });
      return res.status(201).json({ success: true, data: leave });
    }

    const newLeave = {
      _id: 'l_' + Date.now(),
      user: req.user?.id || 'usr_emp',
      userName: req.user?.name || 'Alexander Wright',
      ...req.body,
      status: 'Pending'
    };
    leavesData.unshift(newLeave);
    res.status(201).json({ success: true, data: newLeave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, reviewComment } = req.body;
    if (checkDatabaseStatus()) {
      const leave = await LeaveRequest.findById(req.params.id);
      if (leave) {
        leave.status = status;
        leave.reviewedBy = req.user.name;
        if (reviewComment) leave.reviewComment = reviewComment;
        await leave.save();
        return res.status(200).json({ success: true, data: leave });
      }
    }

    const index = leavesData.findIndex(l => l._id === req.params.id);
    if (index !== -1) {
      leavesData[index].status = status;
      leavesData[index].reviewedBy = req.user?.name || 'HR Admin';
      return res.status(200).json({ success: true, data: leavesData[index] });
    }

    res.status(404).json({ success: false, message: 'Leave request not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
