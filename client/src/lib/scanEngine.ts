import axe from 'axe-core';
import { AxeResults } from '../types/axe';

export async function runScan(url: string, htmlContent: string): Promise<AxeResults> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    // The iframe must be visible and have real dimensions for axe-core
    // to properly analyse the content. Axe-core skips hidden/zero-size elements.
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '-10000px';  // Off-screen but still rendered
    iframe.style.width = '1280px';
    iframe.style.height = '900px';
    iframe.style.border = 'none';
    iframe.style.opacity = '0';      // Invisible to user but rendered by browser
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);

    iframe.onload = async () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) {
          throw new Error('Failed to access iframe document context');
        }

        // Inject axe-core source into the iframe and run it there.
        // This ensures axe analyses the content as a real document,
        // not as a child element of the parent page.
        const axeScript = iframeDoc.createElement('script');
        axeScript.textContent = axe.source;
        iframeDoc.head.appendChild(axeScript);

        // Access the injected axe instance inside the iframe
        const iframeAxe = (iframe.contentWindow as any).axe;
        if (!iframeAxe) {
          throw new Error('Failed to inject axe-core into iframe context');
        }

        const results = await iframeAxe.run(iframeDoc, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag2aaa']
          },
          preload: false
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

export async function scanUrl(url: string, apiBaseUrl: string = 'http://localhost:3001'): Promise<{ results: AxeResults; html: string }> {
  const fetchUrl = `${apiBaseUrl}/api/fetch?url=${encodeURIComponent(url)}`;
  const response = await fetch(fetchUrl);
  
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Proxy server returned status: ${response.status}`);
  }

  const { html } = await response.json();
  const results = await runScan(url, html);
  return { results, html };
}
