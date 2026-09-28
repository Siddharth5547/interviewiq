import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cachedConnection: Promise<typeof mongoose> | null = null;
let lastFailureTime = 0;
const FAILURE_COOLDOWN_MS = 60000; // 1 minute cooldown if MongoDB is unreachable

export const connectDB = async (): Promise<boolean> => {
  // 1. Ready state: 1 = connected
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  // 2. Cooldown check: if connection failed recently, avoid stalling requests with repeated timeouts
  const now = Date.now();
  if (lastFailureTime > 0 && now - lastFailureTime < FAILURE_COOLDOWN_MS) {
    return false;
  }

  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/interviewiq';

  if (!cachedConnection) {
    mongoose.set('strictQuery', false);
    // Disable bufferCommands so queries fail-fast to the resilient fallback instead of hanging
    mongoose.set('bufferCommands', false);
    cachedConnection = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
      socketTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 1,
    }).catch((err) => {
      cachedConnection = null;
      lastFailureTime = Date.now();
      throw err;
    });
  }

  try {
    await cachedConnection;
    lastFailureTime = 0;
    console.log('[DB] Connected successfully to MongoDB.');
    return true;
  } catch (error: any) {
    cachedConnection = null;
    lastFailureTime = Date.now();
    console.warn(`[DB] MongoDB connection failed: ${error.message}. Switching to resilient local in-memory fallback.`);
    return false;
  }
};

export const getDBStatus = () => {
  const ready = mongoose.connection.readyState === 1;
  return {
    isConnected: ready,
    fallbackStoreActive: !ready,
  };
};
