import React, { useRef, useState } from 'react';
import { HighlightOverlay } from './HighlightOverlay';

interface PreviewPanelProps {
  url: string;
  htmlContent: string;
  highlightSelectors: string[][] | null;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ url, htmlContent, highlightSelectors }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [showHighlights, setShowHighlights] = useState(true);

  let processedHtml = htmlContent;
  if (url && htmlContent) {
    const overrideStyle = `
<style id="lumenscope-preview-overrides">
  /* Hide typical loaders/preloaders/spinners */
  #preloader, .preloader, #loader, .loader, #loading, .loading, #loading-screen, .loading-screen,
  [id*="loader-wrapper"], [class*="loader-wrapper"], [id*="loading-overlay"], [class*="loading-overlay"],
  [id*="pre-loader"], [class*="pre-loader"], [id*="spinner"], [class*="spinner"] {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
  /* Ensure key content wrappers are visible (without overriding display type) */
  body, html, #root, #app, #__next, #main-content, main, [id*="page-wrapper"], [class*="page-wrapper"] {
    opacity: 1 !important;
    visibility: visible !important;
  }
  /* Override common JS-dependent visibility patterns */
  .lazyload, .lazy, [data-src] {
    opacity: 1 !important;
    visibility: visible !important;
  }
  /* Highlight style for elements */
  .lumenscope-highlight {
    outline: 3px dashed #ef4444 !important;
    outline-offset: 4px !important;
    background-color: rgba(239, 68, 68, 0.15) !important;
    transition: outline-color 0.2s ease, background-color 0.2s ease !important;
    animation: lumenscope-pulse-highlight 2s infinite !important;
  }
  @keyframes lumenscope-pulse-highlight {
    0% {
      outline-color: rgba(239, 68, 68, 1);
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.4) !important;
    }
    50% {
      outline-color: rgba(239, 68, 68, 0.5);
      box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.1) !important;
    }
    100% {
      outline-color: rgba(239, 68, 68, 1);
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.4) !important;
    }
  }
</style>
`;

    // Script to prevent the iframe from navigating away (which would make it cross-origin
    // and break highlighting). Intercepts all link clicks and form submissions.
    const navigationBlocker = `
<script id="lumenscope-nav-blocker">
(function() {
  document.addEventListener('click', function(e) {
    var target = e.target;
    while (target && target.tagName !== 'A') {
      target = target.parentElement;
    }
    if (target && target.tagName === 'A') {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
  document.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
  }, true);
  window.addEventListener('beforeunload', function(e) {
    e.preventDefault();
  });
})();
</script>
`;

    // Extract origin for base URL
    let baseUrl = url;
    try {
      const parsed = new URL(url);
      baseUrl = parsed.origin + parsed.pathname;
    } catch (e) {
      // Use url as-is
    }

    // Strip <link rel="preload" as="script"> tags to prevent 404s for JS files
    // (scripts are stripped by stripScripts, but their preload hints remain and cause errors)
    processedHtml = processedHtml
      .replace(/<link\b[^>]*\brel\s*=\s*['"](?:preload|modulepreload)['"][^>]*\bas\s*=\s*['"]script['"][^>]*\/?>/gi, '')
      .replace(/<link\b[^>]*\bas\s*=\s*['"]script['"][^>]*\brel\s*=\s*['"](?:preload|modulepreload)['"][^>]*\/?>/gi, '');

    if (!/<base\s+/i.test(htmlContent)) {
      if (/<head[^>]*>/i.test(processedHtml)) {
        processedHtml = processedHtml.replace(/<head([^>]*)>/i, `<head$1>\n<base href="${baseUrl}">\n${overrideStyle}`);
      } else {
        processedHtml = `<base href="${baseUrl}">\n${overrideStyle}\n` + processedHtml;
      }
    } else {
      if (/<head[^>]*>/i.test(processedHtml)) {
        processedHtml = processedHtml.replace(/<head([^>]*)>/i, `<head$1>\n${overrideStyle}`);
      } else {
        processedHtml = overrideStyle + processedHtml;
      }
    }

    // Inject navigation blocker before </body> (or at end if no </body>)
    if (/<\/body>/i.test(processedHtml)) {
      processedHtml = processedHtml.replace(/<\/body>/i, `${navigationBlocker}\n</body>`);
    } else {
      processedHtml += navigationBlocker;
    }
  }

  return (
    <div className="bg-white border border-border-grey rounded-md p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-sm font-bold text-ink uppercase tracking-wider">Page Preview</h2>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showHighlights}
            onChange={(e) => setShowHighlights(e.target.checked)}
            className="w-4 h-4 text-signal-blue border-border-grey rounded focus:ring-signal-blue"
          />
          <span className="font-sans text-xs text-ink font-semibold">Show Highlights</span>
        </label>
      </div>

      <div className="relative w-full h-[450px] border border-border-grey rounded bg-white overflow-hidden">
        <iframe
          ref={iframeRef}
          srcDoc={processedHtml}
          sandbox="allow-same-origin allow-forms"
          title="Scanned Website Preview"
          className="w-full h-full border-none"
        />
        {showHighlights && (
          <HighlightOverlay iframeRef={iframeRef} selectors={highlightSelectors} />
        )}
      </div>
    </div>
  );
};
export default PreviewPanel;
