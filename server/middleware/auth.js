import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { checkDatabaseStatus } from '../config/db.js';
import { mockUsers } from '../config/initialData.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexora_super_secret_jwt_key_2026_elevate_performance');

    if (checkDatabaseStatus()) {
      req.user = await User.findById(decoded.id);
      if (req.user) {
        return next();
      }
    }

    // In-memory lookup or fallback
    req.user = mockUsers.find(u => u._id === decoded.id) || {
      id: decoded.id,
      _id: decoded.id,
      name: 'Alexander Wright',
      role: decoded.role || 'Admin',
      department: 'Engineering'
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token verification failed or expired' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role}' is not authorized to access this action`
      });
    }
    next();
  };
};
