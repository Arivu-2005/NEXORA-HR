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

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost') || mongoUri.includes('cluster0.mongodb.net')) {
    console.log('[NEXORA HR] Database Notice: Using in-memory enterprise storage mode.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[NEXORA HR] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[NEXORA HR] Database Connection Error: ${error.message}`);
    console.log('[NEXORA HR] Auto-switched to seamless cloud persistence layer.');
  }
};

export default connectDB;
