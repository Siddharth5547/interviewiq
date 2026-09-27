import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;
let fallbackStoreActive = false;

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/interviewiq';
  try {
    mongoose.set('strictQuery', false);
    mongoose.set('bufferCommands', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    fallbackStoreActive = false;
    console.log(`[DB] Connected successfully to MongoDB at ${uri}`);
    return true;
  } catch (error: any) {
    console.warn(`[DB] MongoDB connection failed: ${error.message}. Switching to resilient local in-memory fallback.`);
    fallbackStoreActive = true;
    isConnected = false;
    return false;
  }
};

export const getDBStatus = () => {
  const ready = mongoose.connection.readyState === 1;
  return {
    isConnected: ready,
    fallbackStoreActive: fallbackStoreActive || !ready,
  };
};
