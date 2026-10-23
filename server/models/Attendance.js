import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  checkIn: {
    type: String,
    default: null
  },
  checkOut: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Present', 'Late', 'Half Day', 'Absent', 'Remote'],
    default: 'Present'
  },
  workHours: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: 'Regular shift'
  }
}, {
  timestamps: true
});

// Index to ensure 1 attendance record per user per day
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', AttendanceSchema);
