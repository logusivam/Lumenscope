import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

export const corsMiddleware = () => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  return cors({
    origin: (origin, callback) => {
      // Allow same-origin requests or matching FRONTEND_URL
      if (!origin || origin === frontendUrl) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'OPTIONS'],
    credentials: true
  });
};
