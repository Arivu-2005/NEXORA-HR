export const mockUsers = [
  {
    _id: 'usr_admin',
    name: 'Alexander Wright',
    email: 'admin@nexora.com',
    password: 'password123',
    role: 'Admin',
    department: 'Engineering',
    designation: 'Chief Technology Officer',
    phone: '+1 (555) 901-2345',
    salary: 165000,
    status: 'Active'
  },
  {
    _id: 'usr_hr',
    name: 'Sarah Jenkins',
    email: 'hr@nexora.com',
    password: 'password123',
    role: 'HR',
    department: 'Human Resources',
    designation: 'Head of People Operations',
    phone: '+1 (555) 802-3456',
    salary: 110000,
    status: 'Active'
  },
  {
    _id: 'usr_manager',
    name: 'Liam Vance',
    email: 'manager@nexora.com',
    password: 'password123',
    role: 'Manager',
    department: 'Engineering',
    designation: 'Engineering Lead',
    phone: '+1 (555) 703-4567',
    salary: 125000,
    status: 'Active'
  },
  {
    _id: 'usr_emp',
    name: 'Emily Davis',
    email: 'employee@nexora.com',
    password: 'password123',
    role: 'Employee',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    phone: '+1 (555) 604-5678',
    salary: 92000,
    status: 'Active'
  },
  {
    _id: 'usr_emp2',
    name: 'Noah Patel',
    email: 'noah@nexora.com',
    password: 'password123',
    role: 'Employee',
    department: 'Product Management',
    designation: 'Product Analyst',
    phone: '+1 (555) 505-6789',
    salary: 84000,
    status: 'Active'
  }
];

export const mockDepartments = [
  {
    _id: 'd1',
    name: 'Engineering',
    code: 'ENG',
    headOfDepartment: 'Sophia Chen',
    budget: 450000,
    location: 'Building A, 4th Floor',
    memberCount: 18,
    description: 'Core software engineering, QA testing, DevOps and infrastructure.'
  },
  {
    _id: 'd2',
    name: 'Human Resources',
    code: 'HRD',
    headOfDepartment: 'David Vance',
    budget: 180000,
    location: 'Building B, 2nd Floor',
    memberCount: 6,
    description: 'Talent sourcing, internal culture, compensation, and workplace welfare.'
  },
  {
    _id: 'd3',
    name: 'Product Management',
    code: 'PRD',
    headOfDepartment: 'Elena Rostova',
    budget: 240000,
    location: 'Building A, 3rd Floor',
    memberCount: 8,
    description: 'Product lifecycle, customer feature discovery, and delivery milestones.'
  },
  {
    _id: 'd4',
    name: 'Sales & Marketing',
    code: 'MKT',
    headOfDepartment: 'Marcus Sterling',
    budget: 320000,
    location: 'Building C, 1st Floor',
    memberCount: 14,
    description: 'Outreach, enterprise marketing, brand campaigns, and client success.'
  }
];

export const mockAttendance = [
  {
    _id: 'a1',
    user: 'usr_emp',
    userName: 'Emily Davis',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:05 AM',
    checkOut: '05:45 PM',
    status: 'Present',
    workHours: 8.5,
    notes: 'Main campus office'
  },
  {
    _id: 'a2',
    user: 'usr_emp2',
    userName: 'Noah Patel',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:42 AM',
    checkOut: null,
    status: 'Late',
    workHours: 7.2,
    notes: 'Traffic delay'
  },
  {
    _id: 'a3',
    user: 'usr_manager',
    userName: 'Liam Vance',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    checkIn: '08:50 AM',
    checkOut: '06:10 PM',
    status: 'Present',
    workHours: 9.0,
    notes: 'Sprint planning day'
  }
];

export const mockLeaves = [
  {
    _id: 'l1',
    user: 'usr_emp',
    userName: 'Emily Davis',
    leaveType: 'Paid Vacation',
    startDate: '2026-11-10',
    endDate: '2026-11-14',
    days: 5,
    reason: 'Family annual holiday trip',
    status: 'Approved',
    reviewedBy: 'Sarah Jenkins',
    reviewComment: 'Approved. Enjoy your vacation!'
  },
  {
    _id: 'l2',
    user: 'usr_emp2',
    userName: 'Noah Patel',
    leaveType: 'Sick Leave',
    startDate: '2026-10-28',
    endDate: '2026-10-29',
    days: 2,
    reason: 'Medical checkup and doctor consultation',
    status: 'Pending',
    reviewedBy: null,
    reviewComment: ''
  }
];

export const mockPerformance = [
  {
    _id: 'p1',
    user: 'usr_emp',
    employeeName: 'Emily Davis',
    reviewerName: 'Liam Vance',
    cycle: 'Q1 - 2026',
    goalTitle: 'UI Architecture Modernization',
    kpiMetrics: 'Deliver Vite + React refactor with zero regression and 98% test coverage',
    kpiProgress: 92,
    rating: 5,
    feedback: 'Outstanding frontend work! System load speeds improved significantly.',
    status: 'Completed'
  },
  {
    _id: 'p2',
    user: 'usr_emp2',
    employeeName: 'Noah Patel',
    reviewerName: 'Alexander Wright',
    cycle: 'Q1 - 2026',
    goalTitle: 'Product User Journey Mapping',
    kpiMetrics: 'Map complete user onboarding funnel and boost retention by 15%',
    kpiProgress: 75,
    rating: 4,
    feedback: 'Great progress. Working effectively with customer success team.',
    status: 'In Progress'
  }
];
