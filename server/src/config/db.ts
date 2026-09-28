import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cachedConnection: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<boolean> => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/interviewiq';

  if (!cachedConnection) {
    mongoose.set('strictQuery', false);
    mongoose.set('bufferCommands', true);
    cachedConnection = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    }).catch((err) => {
      cachedConnection = null;
      throw err;
    });
  }

  try {
    await cachedConnection;
    console.log('[DB] Connected successfully to MongoDB.');
    return true;
  } catch (error: any) {
    cachedConnection = null;
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
