import axeSource from 'axe-core/axe.min.js?raw';
import { AxeResults } from '../types/axe';

function prepareHtmlForAudit(htmlContent: string, baseUrl: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // 1. Add/update <base> tag to resolve relative assets correctly
    let baseElement = doc.querySelector('base');
    if (!baseElement) {
      baseElement = doc.createElement('base');
      doc.head.insertBefore(baseElement, doc.head.firstChild);
    }
    baseElement.setAttribute('href', baseUrl);

    // 2. Remove all script tags to prevent them from running
    const scripts = doc.querySelectorAll('script');
    scripts.forEach(script => script.remove());

    // 3. Remove inline event handlers (on*) to prevent any code execution
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(el => {
      const attrs = Array.from(el.attributes);
      attrs.forEach(attr => {
        if (attr.name.toLowerCase().startsWith('on')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return doc.documentElement.outerHTML;
  } catch (e) {
    console.error('Error preparing HTML for audit:', e);
    return htmlContent;
  }
}

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

        // Inject raw axe-core source into the iframe and run it there.
        // Running axe within the iframe avoids cross-origin/cross-frame type check errors.
        const axeScript = iframeDoc.createElement('script');
        axeScript.textContent = axeSource;
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

    iframe.srcdoc = prepareHtmlForAudit(htmlContent, url);
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
