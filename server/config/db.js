import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexora_hr');
    console.log(`[NEXORA HR] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[NEXORA HR] Database Connection Error: ${error.message}`);
    // If running in development without local mongo, log guidance
    console.log('[NEXORA HR] Tip: Make sure MongoDB is running locally or specify a MongoDB Atlas connection string in server/.env');
  }
};

export default connectDB;
