import { app } from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
  } catch (err) {
    // Non-blocking fallback is handled in connectDB
  }

  return app(req, res);
}

