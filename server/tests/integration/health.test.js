import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import healthRouter from '../../src/routes/health.js';

describe('GET /health integration', () => {
  let server;
  let port;

  beforeAll(async () => {
    const app = express();
    app.use('/health', healthRouter);
    
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        port = server.address().port;
        resolve();
      });
    });
  });

  afterAll(() => {
    server.close();
  });

  it('should return 200 and status ok', async () => {
    const response = await fetch(`http://localhost:${port}/health`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ status: 'ok' });
  });
});
