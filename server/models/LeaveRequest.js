import mongoose from 'mongoose';

const LeaveRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  leaveType: {
    type: String,
    enum: ['Paid Vacation', 'Sick Leave', 'Casual Leave', 'Maternity/Paternity', 'Unpaid'],
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  days: {
    type: Number,
    required: true,
    min: 1
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  reviewedBy: {
    type: String,
    default: null
  },
  reviewComment: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('LeaveRequest', LeaveRequestSchema);
