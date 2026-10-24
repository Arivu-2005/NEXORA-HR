import Department from '../models/Department.js';
import User from '../models/User.js';
import { checkDatabaseStatus } from '../config/db.js';
import { mockDepartments } from '../config/initialData.js';

let deptList = [...mockDepartments];

export const getDepartments = async (req, res) => {
  try {
    if (checkDatabaseStatus()) {
      const departments = await Department.find();
      const enriched = await Promise.all(
        departments.map(async (dept) => {
          const memberCount = await User.countDocuments({ department: dept.name });
          return { ...dept.toObject(), memberCount };
        })
      );
      return res.status(200).json({ success: true, count: enriched.length, data: enriched });
    }

    res.status(200).json({ success: true, count: deptList.length, data: deptList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    if (checkDatabaseStatus()) {
      const dept = await Department.create(req.body);
      return res.status(201).json({ success: true, data: dept });
    }
    const newDept = {
      _id: 'd_' + Date.now(),
      ...req.body,
      memberCount: 1
    };
    deptList.push(newDept);
    res.status(201).json({ success: true, data: newDept });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    if (checkDatabaseStatus()) {
      await Department.findByIdAndDelete(req.params.id);
    }
    deptList = deptList.filter(d => d._id !== req.params.id);
    res.status(200).json({ success: true, message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
