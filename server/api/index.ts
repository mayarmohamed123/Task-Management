import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
  } catch (error: any) {
    console.error('Database connection error in Vercel handler:', error);
    return res.status(500).json({
      success: false,
      message: `Database Connection Failed: ${error.message || 'Please configure MONGODB_URI in Vercel Project Settings.'}`,
    });
  }
  return app(req, res);
}
