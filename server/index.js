import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware } from './src/middleware/cors.js';
import { rateLimitMiddleware } from './src/middleware/rateLimit.js';
import { errorHandlerMiddleware } from './src/middleware/errorHandler.js';
import fetchRouter from './src/routes/fetch.js';
import contactRouter from './src/routes/contact.js';
import healthRouter from './src/routes/health.js';
import { BACKEND_URL } from './src/config.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || new URL(BACKEND_URL).port || 3001;

// Global Middleware
app.use(corsMiddleware());
app.use(express.json());

// Routes
app.use('/health', healthRouter);
app.use('/api/fetch', rateLimitMiddleware, fetchRouter);
app.use('/api/contact', rateLimitMiddleware, contactRouter);

// Error handling
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`[Lumenscope Proxy Server] running on http://localhost:${port}`);
});
