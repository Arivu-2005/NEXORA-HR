import PerformanceReview from '../models/PerformanceReview.js';

// @desc    Get performance reviews & KPIs
// @route   GET /api/performance
export const getPerformance = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Employee') {
      query.user = req.user.id;
    }
    const reviews = await PerformanceReview.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new review / KPI goal
// @route   POST /api/performance
export const createPerformanceReview = async (req, res) => {
  try {
    const { userId, employeeName, goalTitle, kpiMetrics, kpiProgress, rating, feedback, cycle } = req.body;

    const review = await PerformanceReview.create({
      user: userId || req.user.id,
      employeeName: employeeName || req.user.name,
      reviewerName: req.user.name,
      goalTitle,
      kpiMetrics: kpiMetrics || 'Operational efficiency target',
      kpiProgress: kpiProgress !== undefined ? kpiProgress : 85,
      rating: rating || 4,
      feedback: feedback || 'Consistent solid performance',
      cycle: cycle || 'Q1 - 2026',
      status: 'Completed'
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update performance review / progress
// @route   PUT /api/performance/:id
export const updatePerformanceReview = async (req, res) => {
  try {
    const review = await PerformanceReview.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
