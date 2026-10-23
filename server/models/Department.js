import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Department code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  headOfDepartment: {
    type: String,
    default: 'Unassigned'
  },
  budget: {
    type: Number,
    default: 150000
  },
  location: {
    type: String,
    default: 'Headquarters - Floor 3'
  },
  description: {
    type: String,
    default: 'Core business operational unit'
  }
}, {
  timestamps: true
});

export default mongoose.model('Department', DepartmentSchema);
