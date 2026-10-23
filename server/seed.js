import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Department from './models/Department.js';
import Attendance from './models/Attendance.js';
import LeaveRequest from './models/LeaveRequest.js';
import PerformanceReview from './models/PerformanceReview.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexora_hr');
    console.log('[NEXORA HR] Connected to DB for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Department.deleteMany();
    await Attendance.deleteMany();
    await LeaveRequest.deleteMany();
    await PerformanceReview.deleteMany();

    console.log('[NEXORA HR] Cleared old data.');

    // Seed Departments
    const departments = await Department.create([
      {
        name: 'Engineering',
        code: 'ENG',
        headOfDepartment: 'Sophia Chen',
        budget: 450000,
        location: 'Building A, 4th Floor',
        description: 'Software development, cloud infrastructure, and technical design.'
      },
      {
        name: 'Human Resources',
        code: 'HRD',
        headOfDepartment: 'David Vance',
        budget: 180000,
        location: 'Building B, 2nd Floor',
        description: 'Talent acquisition, employee wellness, policies, and retention.'
      },
      {
        name: 'Product Management',
        code: 'PRD',
        headOfDepartment: 'Elena Rostova',
        budget: 240000,
        location: 'Building A, 3rd Floor',
        description: 'Product lifecycle, customer research, roadmap, and delivery.'
      },
      {
        name: 'Sales & Marketing',
        code: 'MKT',
        headOfDepartment: 'Marcus Sterling',
        budget: 320000,
        location: 'Building C, 1st Floor',
        description: 'Client expansion, marketing campaigns, and partnerships.'
      }
    ]);

    // Seed Users (Admin, HR, Manager, Employee)
    const adminUser = await User.create({
      name: 'Alexander Wright',
      email: 'admin@nexora.com',
      password: 'password123',
      role: 'Admin',
      department: 'Engineering',
      designation: 'Chief Technology Officer',
      phone: '+1 (555) 901-2345',
      salary: 165000,
      status: 'Active'
    });

    const hrUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'hr@nexora.com',
      password: 'password123',
      role: 'HR',
      department: 'Human Resources',
      designation: 'Head of People Operations',
      phone: '+1 (555) 802-3456',
      salary: 110000,
      status: 'Active'
    });

    const managerUser = await User.create({
      name: 'Liam Vance',
      email: 'manager@nexora.com',
      password: 'password123',
      role: 'Manager',
      department: 'Engineering',
      designation: 'Engineering Lead',
      phone: '+1 (555) 703-4567',
      salary: 125000,
      status: 'Active'
    });

    const employeeUser = await User.create({
      name: 'Emily Davis',
      email: 'employee@nexora.com',
      password: 'password123',
      role: 'Employee',
      department: 'Engineering',
      designation: 'Senior Frontend Engineer',
      phone: '+1 (555) 604-5678',
      salary: 92000,
      status: 'Active',
      managerId: managerUser._id
    });

    const employeeUser2 = await User.create({
      name: 'Noah Patel',
      email: 'noah@nexora.com',
      password: 'password123',
      role: 'Employee',
      department: 'Product Management',
      designation: 'Product Analyst',
      phone: '+1 (555) 505-6789',
      salary: 84000,
      status: 'Active'
    });

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Seed Attendance
    await Attendance.create([
      {
        user: employeeUser._id,
        userName: employeeUser.name,
        date: today,
        checkIn: '09:05 AM',
        checkOut: '05:45 PM',
        status: 'Present',
        workHours: 8.5,
        notes: 'Main campus office'
      },
      {
        user: employeeUser2._id,
        userName: employeeUser2.name,
        date: today,
        checkIn: '09:42 AM',
        checkOut: null,
        status: 'Late',
        workHours: 7.2,
        notes: 'Traffic delay'
      },
      {
        user: managerUser._id,
        userName: managerUser.name,
        date: yesterday,
        checkIn: '08:50 AM',
        checkOut: '06:10 PM',
        status: 'Present',
        workHours: 9.0,
        notes: 'Sprint planning day'
      }
    ]);

    // Seed Leaves
    await LeaveRequest.create([
      {
        user: employeeUser._id,
        userName: employeeUser.name,
        leaveType: 'Paid Vacation',
        startDate: '2026-11-10',
        endDate: '2026-11-14',
        days: 5,
        reason: 'Family annual holiday',
        status: 'Approved',
        reviewedBy: hrUser.name,
        reviewComment: 'Approved. Enjoy your time off!'
      },
      {
        user: employeeUser2._id,
        userName: employeeUser2.name,
        leaveType: 'Sick Leave',
        startDate: '2026-10-28',
        endDate: '2026-10-29',
        days: 2,
        reason: 'Medical checkup and recovery',
        status: 'Pending'
      }
    ]);

    // Seed Performance
    await PerformanceReview.create([
      {
        user: employeeUser._id,
        employeeName: employeeUser.name,
        reviewerName: managerUser.name,
        cycle: 'Q1 - 2026',
        goalTitle: 'UI Architecture Modernization',
        kpiMetrics: 'Deliver Vite + React refactor with zero regression and 98% test coverage',
        kpiProgress: 92,
        rating: 5,
        feedback: 'Outstanding frontend work! System load speeds improved significantly.',
        status: 'Completed'
      },
      {
        user: employeeUser2._id,
        employeeName: employeeUser2.name,
        reviewerName: adminUser.name,
        cycle: 'Q1 - 2026',
        goalTitle: 'Product User Journey Mapping',
        kpiMetrics: 'Map complete user onboarding funnel and boost retention by 15%',
        kpiProgress: 78,
        rating: 4,
        feedback: 'Great insights delivered during product leadership review.',
        status: 'In Progress'
      }
    ]);

    console.log('[NEXORA HR] Seed completed successfully!');
    console.log('[NEXORA HR] Demo Logins:');
    console.log(' - Admin:    admin@nexora.com    / password123');
    console.log(' - HR:       hr@nexora.com       / password123');
    console.log(' - Manager:  manager@nexora.com  / password123');
    console.log(' - Employee: employee@nexora.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('[NEXORA HR] Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
