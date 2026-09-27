let appInstance: any = null;
let dbInitialized = false;

export default async function handler(req: any, res: any) {
  if (!appInstance) {
    const { app } = await import('../server/src/app.js');
    const { connectDB } = await import('../server/src/config/db.js');
    if (!dbInitialized) {
      try {
        await connectDB();
      } catch (err) {
        console.warn('MongoDB connect warning in serverless handler:', err);
      }
      dbInitialized = true;
    }
    appInstance = app;
  }
  return appInstance(req, res);
}
