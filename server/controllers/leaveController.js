import LeaveRequest from '../models/LeaveRequest.js';

// @desc    Get all leave requests
// @route   GET /api/leaves
export const getLeaves = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Employee') {
      query.user = req.user.id;
    }
    const leaves = await LeaveRequest.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply for leave
// @route   POST /api/leaves
export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, days, reason } = req.body;

    const leave = await LeaveRequest.create({
      user: req.user.id,
      userName: req.user.name,
      leaveType,
      startDate,
      endDate,
      days: days || 1,
      reason,
      status: 'Pending'
    });

    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update leave status (Approve / Reject)
// @route   PUT /api/leaves/:id
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, reviewComment } = req.body;
    
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    leave.status = status;
    leave.reviewedBy = req.user.name;
    if (reviewComment) leave.reviewComment = reviewComment;

    await leave.save();
    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
