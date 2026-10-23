import mongoose from 'mongoose';

const PerformanceReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  reviewerName: {
    type: String,
    required: true
  },
  cycle: {
    type: String,
    default: 'Q1 - 2026'
  },
  goalTitle: {
    type: String,
    required: true
  },
  kpiMetrics: {
    type: String,
    default: '95% on-time project completion & team satisfaction score'
  },
  kpiProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 80
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4
  },
  feedback: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Under Review'],
    default: 'Completed'
  }
}, {
  timestamps: true
});

export default mongoose.model('PerformanceReview', PerformanceReviewSchema);
