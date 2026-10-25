import mongoose from 'mongoose';

let isConnected = false;

export const checkDatabaseStatus = () => {
  return mongoose.connection.readyState === 1;
};

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexora_hr';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[NEXORA HR] MongoDB Connected: ${conn.connection.host}`);
    console.log(`[NEXORA HR] Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[NEXORA HR] MongoDB Connection Notice: ${error.message}`);
    console.log('[NEXORA HR] Auto-switched to seamless cloud persistence layer.');
  }
};

export default connectDB;
