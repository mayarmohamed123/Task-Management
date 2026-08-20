import mongoose from 'mongoose';
import { env } from './env.js';

let cachedConn: typeof mongoose | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  // Reuse existing active connection if already connected in serverless container
  if (cachedConn && mongoose.connection.readyState === 1) {
    return cachedConn;
  }

  if (mongoose.connection.readyState === 1) {
    cachedConn = mongoose;
    return mongoose;
  }

  const mongoUri = env.MONGODB_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error(
      'MONGODB_URI environment variable is missing. Please add MONGODB_URI (e.g. MongoDB Atlas cluster link) in your Vercel Project Environment Variables.'
    );
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout fast after 5s if DB unreachable
    });
    cachedConn = conn;
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${(error as Error).message}`);
    throw error;
  }
};
