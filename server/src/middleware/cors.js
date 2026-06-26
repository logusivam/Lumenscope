import cors from 'cors';
import dotenv from 'dotenv';
import { FRONTEND_URL } from '../config.js';

dotenv.config();

export const corsMiddleware = () => {
  const frontendUrl = FRONTEND_URL;
  
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
