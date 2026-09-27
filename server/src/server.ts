import { app } from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database and start listener
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[InterviewIQ Server] Running on http://localhost:${PORT}`);
  });
});
