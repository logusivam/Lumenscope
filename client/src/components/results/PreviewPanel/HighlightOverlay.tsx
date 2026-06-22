import React, { useEffect, useState } from 'react';

interface HighlightOverlayProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  selectors: string[][] | null;
}

export const HighlightOverlay: React.FC<HighlightOverlayProps> = ({ iframeRef, selectors }) => {
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number }[]>([]);

  useEffect(() => {
    if (!iframeRef.current || !selectors || selectors.length === 0) {
      setCoords([]);
      return;
    }

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const newCoords: typeof coords = [];

    for (const selectorGroup of selectors) {
      try {
        const selector = selectorGroup.join(' ');
        const element = doc.querySelector(selector);
        if (element) {
          const rect = element.getBoundingClientRect();
          const scrollTop = doc.documentElement.scrollTop || doc.body.scrollTop;
          const scrollLeft = doc.documentElement.scrollLeft || doc.body.scrollLeft;

          newCoords.push({
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft,
            width: rect.width,
            height: rect.height
          });
        }
      } catch (err) {
        console.warn('Selector lookup failed:', selectorGroup, err);
      }
    }

    setCoords(newCoords);
  }, [iframeRef, selectors]);

  if (coords.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {coords.map((coord, idx) => (
        <div
          key={idx}
          className="absolute border-2 border-severity-critical bg-severity-critical/20 animate-pulse rounded"
          style={{
            top: `${coord.top}px`,
            left: `${coord.left}px`,
            width: `${coord.width}px`,
            height: `${coord.height}px`,
            boxShadow: '0 0 4px rgba(209, 67, 67, 0.4)'
          }}
        />
      ))}
    </div>
  );
};
export default HighlightOverlay;
