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
  /* Force display of hidden content wrappers */
  body, html, #root, #app, #__next, #main-content, main, [id*="page-wrapper"], [class*="page-wrapper"] {
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
</style>
`;

    if (!/<base\s+/i.test(htmlContent)) {
      if (/<head[^>]*>/i.test(htmlContent)) {
        processedHtml = htmlContent.replace(/<head([^>]*)>/i, `<head$1>\n<base href="${url}">\n${overrideStyle}`);
      } else {
        processedHtml = `<base href="${url}">\n${overrideStyle}\n` + htmlContent;
      }
    } else {
      if (/<head[^>]*>/i.test(htmlContent)) {
        processedHtml = htmlContent.replace(/<head([^>]*)>/i, `<head$1>\n${overrideStyle}`);
      } else {
        processedHtml = overrideStyle + htmlContent;
      }
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
