import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware } from './src/middleware/cors.js';
import { rateLimitMiddleware } from './src/middleware/rateLimit.js';
import { errorHandlerMiddleware } from './src/middleware/errorHandler.js';
import fetchRouter from './src/routes/fetch.js';
import healthRouter from './src/routes/health.js';
import { BACKEND_URL } from './src/config.js';

dotenv.config();

const app = express();
const port = process.env.PORT || new URL(BACKEND_URL).port || 3001;

// Global Middleware
app.use(corsMiddleware());
app.use(express.json());

// Routes
app.use('/health', healthRouter);
app.use('/api/fetch', rateLimitMiddleware, fetchRouter);

// Error handling
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`[Lumenscope Proxy Server] running on http://localhost:${port}`);
});
