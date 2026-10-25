import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to Database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve Pure Vanilla HTML/CSS/JS frontend from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Welcome / Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'NEXORA HR Backend API',
    tagline: 'Empower People. Elevate Performance.',
    timestamp: new Date()
  });
});

// Mount REST Routers
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Fallback all other GET requests to public index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[NEXORA HR Error]', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`[NEXORA HR] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[NEXORA HR] Tagline: "Empower People. Elevate Performance."`);
});
