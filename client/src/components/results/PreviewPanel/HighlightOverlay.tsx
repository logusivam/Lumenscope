import React, { useEffect } from 'react';

interface HighlightOverlayProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  selectors: string[][] | null;
}

export const HighlightOverlay: React.FC<HighlightOverlayProps> = ({ iframeRef, selectors }) => {
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const applyHighlight = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        // 1. Clear any existing highlights
        const existing = doc.querySelectorAll('.lumenscope-highlight');
        existing.forEach((el) => {
          el.classList.remove('lumenscope-highlight');
        });

        if (!selectors || selectors.length === 0) return;

        // 2. Add highlight class to new elements
        let scrolled = false;
        for (const selectorGroup of selectors) {
          try {
            const selector = selectorGroup.join(' ');
            const element = doc.querySelector(selector);
            if (element) {
              element.classList.add('lumenscope-highlight');
              if (!scrolled) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                scrolled = true;
              }
            }
          } catch (err) {
            console.warn('Selector lookup failed:', selectorGroup, err);
          }
        }
      } catch (err) {
        console.warn('Could not access iframe document for highlighting:', err);
      }
    };

    // Apply immediately if already loaded
    applyHighlight();

    // Also apply when iframe loads (in case it reloads or wasn't ready)
    iframe.addEventListener('load', applyHighlight);

    return () => {
      iframe.removeEventListener('load', applyHighlight);
      
      // Clean up highlights if possible
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          const existing = doc.querySelectorAll('.lumenscope-highlight');
          existing.forEach((el) => {
            el.classList.remove('lumenscope-highlight');
          });
        }
      } catch (e) {
        // Ignore cross-origin cleanup errors on unmount
      }
    };
  }, [iframeRef, selectors]);

  return null;
};
export default HighlightOverlay;
