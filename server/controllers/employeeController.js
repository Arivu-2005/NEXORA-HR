import User from '../models/User.js';
import { checkDatabaseStatus } from '../config/db.js';
import { mockUsers } from '../config/initialData.js';

let employeesData = [...mockUsers];

export const getEmployees = async (req, res) => {
  try {
    const { search, department, role, status } = req.query;

    if (checkDatabaseStatus()) {
      let query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { designation: { $regex: search, $options: 'i' } }
        ];
      }
      if (department && department !== 'All') query.department = department;
      if (role && role !== 'All') query.role = role;
      if (status && status !== 'All') query.status = status;

      const employees = await User.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: employees.length, data: employees });
    }

    // In-memory filter
    let list = [...employeesData];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.designation.toLowerCase().includes(q));
    }
    if (department && department !== 'All') list = list.filter(e => e.department === department);
    if (role && role !== 'All') list = list.filter(e => e.role === role);
    if (status && status !== 'All') list = list.filter(e => e.status === status);

    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    if (checkDatabaseStatus()) {
      const emp = await User.findById(req.params.id);
      if (emp) return res.status(200).json({ success: true, data: emp });
    }
    const emp = employeesData.find(e => e._id === req.params.id);
    if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.status(200).json({ success: true, data: emp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    if (checkDatabaseStatus()) {
      const emp = await User.create(req.body);
      return res.status(201).json({ success: true, data: emp });
    }
    const newEmp = {
      _id: 'emp_' + Date.now(),
      ...req.body,
      status: req.body.status || 'Active'
    };
    employeesData.unshift(newEmp);
    res.status(201).json({ success: true, data: newEmp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    if (checkDatabaseStatus()) {
      const emp = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (emp) return res.status(200).json({ success: true, data: emp });
    }
    const index = employeesData.findIndex(e => e._id === req.params.id);
    if (index !== -1) {
      employeesData[index] = { ...employeesData[index], ...req.body };
      return res.status(200).json({ success: true, data: employeesData[index] });
    }
    res.status(404).json({ success: false, message: 'Employee not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    if (checkDatabaseStatus()) {
      await User.findByIdAndDelete(req.params.id);
    }
    employeesData = employeesData.filter(e => e._id !== req.params.id);
    res.status(200).json({ success: true, message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
