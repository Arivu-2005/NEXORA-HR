import PerformanceReview from '../models/PerformanceReview.js';
import { checkDatabaseStatus } from '../config/db.js';
import { mockPerformance } from '../config/initialData.js';

let performanceData = [...mockPerformance];

export const getPerformance = async (req, res) => {
  try {
    if (checkDatabaseStatus()) {
      let query = {};
      if (req.user.role === 'Employee') query.user = req.user.id;
      const reviews = await PerformanceReview.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: reviews.length, data: reviews });
    }

    res.status(200).json({ success: true, count: performanceData.length, data: performanceData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPerformanceReview = async (req, res) => {
  try {
    if (checkDatabaseStatus()) {
      const review = await PerformanceReview.create({
        ...req.body,
        reviewerName: req.user.name,
        status: 'Completed'
      });
      return res.status(201).json({ success: true, data: review });
    }

    const newRev = {
      _id: 'p_' + Date.now(),
      reviewerName: req.user?.name || 'Alexander Wright',
      status: 'Completed',
      ...req.body
    };
    performanceData.unshift(newRev);
    res.status(201).json({ success: true, data: newRev });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePerformanceReview = async (req, res) => {
  try {
    if (checkDatabaseStatus()) {
      const review = await PerformanceReview.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (review) return res.status(200).json({ success: true, data: review });
    }

    const index = performanceData.findIndex(p => p._id === req.params.id);
    if (index !== -1) {
      performanceData[index] = { ...performanceData[index], ...req.body };
      return res.status(200).json({ success: true, data: performanceData[index] });
    }

    res.status(404).json({ success: false, message: 'Review not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
