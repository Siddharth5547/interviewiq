import multer from 'multer';
import path from 'path';

// Memory storage to process files directly in memory
const storage = multer.memoryStorage();

const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
const allowedMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/octet-stream', // fallback for some browsers
];

export const uploadResumeMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error(`Unsupported file type: ${ext}. Please upload a PDF, DOC, DOCX, or TXT file.`));
    }
    cb(null, true);
  },
});
