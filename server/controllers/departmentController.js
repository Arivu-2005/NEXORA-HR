import Department from '../models/Department.js';
import User from '../models/User.js';

// @desc    Get all departments with member count
// @route   GET /api/departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    
    // Count employees in each department
    const enriched = await Promise.all(
      departments.map(async (dept) => {
        const memberCount = await User.countDocuments({ department: dept.name });
        return {
          ...dept.toObject(),
          memberCount
        };
      })
    );

    res.status(200).json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create department
// @route   POST /api/departments
export const createDepartment = async (req, res) => {
  try {
    const { name, code, headOfDepartment, budget, location, description } = req.body;
    
    const existing = await Department.findOne({ $or: [{ name }, { code }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Department name or code already exists' });
    }

    const dept = await Department.create({
      name,
      code,
      headOfDepartment: headOfDepartment || 'To be assigned',
      budget: budget || 100000,
      location: location || 'Main Campus',
      description: description || 'Operational Division'
    });

    res.status(201).json({ success: true, data: dept });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
export const deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.status(200).json({ success: true, message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
