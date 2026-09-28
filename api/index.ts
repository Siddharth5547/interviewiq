let appInstance: any = null;

export default async function handler(req: any, res: any) {
  if (!appInstance) {
    const { app } = await import('../server/src/app.js');
    appInstance = app;
  }

  const { connectDB } = await import('../server/src/config/db.js');
  try {
    await connectDB();
  } catch (err) {
    console.warn('MongoDB connect warning in serverless handler:', err);
  }

  return appInstance(req, res);
}
