import express from 'express';
import { validateUrl } from '../utils/validateUrl.js';
import { stripScripts } from '../utils/stripScripts.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL query parameter is required' });
  }

  if (!validateUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format. Must start with http:// or https://' });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'max-age=0',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return res.status(502).json({ error: `Target website returned status: ${response.status}` });
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return res.status(400).json({ error: 'Target URL did not return HTML content' });
    }

    const rawHtml = await response.text();
    const cleanHtml = stripScripts(rawHtml);

    res.status(200).json({ html: cleanHtml });
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Fetch request timed out after 10 seconds' });
    }
    console.error('Fetch error:', error);
    res.status(502).json({ error: 'Failed to fetch the target website. Check the URL or host availability.' });
  }
});

export default router;
