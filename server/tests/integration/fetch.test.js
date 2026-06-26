import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import fetchRouter from '../../src/routes/fetch.js';

describe('GET /api/fetch integration', () => {
  let proxyServer;
  let targetServer;
  let proxyPort;
  let targetPort;

  beforeAll(async () => {
    // Setup target server that serves dummy HTML
    const targetApp = express();
    targetApp.get('/test', (req, res) => {
      res.header('Content-Type', 'text/html');
      res.send('<html><body><h1>Hello</h1><script>alert(1)</script></body></html>');
    });
    
    await new Promise((resolve) => {
      targetServer = targetApp.listen(0, () => {
        targetPort = targetServer.address().port;
        resolve();
      });
    });

    // Setup proxy server
    const proxyApp = express();
    proxyApp.use('/api/fetch', fetchRouter);

    await new Promise((resolve) => {
      proxyServer = proxyApp.listen(0, () => {
        proxyPort = proxyServer.address().port;
        resolve();
      });
    });
  });

  afterAll(() => {
    targetServer.close();
    proxyServer.close();
  });

  it('should fetch target site, strip scripts and return html content', async () => {
    const targetUrl = encodeURIComponent(`http://localhost:${targetPort}/test`);
    const response = await fetch(`http://localhost:${proxyPort}/api/fetch?url=${targetUrl}`);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    
    expect(data.html).toBe('<html><body><h1>Hello</h1></body></html>');
    expect(data.html).not.toContain('<script>');
  });

  it('should return 400 for invalid URLs', async () => {
    const response = await fetch(`http://localhost:${proxyPort}/api/fetch?url=not-a-url`);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });
});
