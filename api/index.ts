import { app } from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

let dbInitialized = false;

export default async function handler(req: any, res: any) {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
  return app(req, res);
}
