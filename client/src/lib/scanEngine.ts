import axe from 'axe-core';
import { AxeResults } from '../types/axe';

export async function runScan(url: string, htmlContent: string): Promise<AxeResults> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    iframe.onload = async () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) {
          throw new Error('Failed to access iframe document context');
        }

        const results = await axe.run(iframeDoc, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag2aaa']
          }
        });

        document.body.removeChild(iframe);

        resolve({
          url,
          timestamp: new Date().toISOString(),
          passes: results.passes,
          violations: results.violations as any[],
          incomplete: results.incomplete,
          inapplicable: results.inapplicable
        });
      } catch (err) {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        reject(err);
      }
    };

    iframe.srcdoc = htmlContent;
  });
}

export async function scanUrl(url: string, apiBaseUrl: string = 'http://localhost:3001'): Promise<AxeResults> {
  const fetchUrl = `${apiBaseUrl}/api/fetch?url=${encodeURIComponent(url)}`;
  const response = await fetch(fetchUrl);
  
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Proxy server returned status: ${response.status}`);
  }

  const { html } = await response.json();
  return runScan(url, html);
}
