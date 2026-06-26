import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ScanProgressOverlayProps {
  url: string;
}

export const ScanProgressOverlay: React.FC<ScanProgressOverlayProps> = ({ url }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper/90 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scan-title"
    >
      <div className="w-full max-w-md text-center">
        <h2 id="scan-title" className="font-sans text-2xl font-bold text-ink mb-2">
          Auditing Website
        </h2>
        <p className="font-mono text-sm text-minor-grey mb-8 truncate" title={url}>
          {url}
        </p>

        {/* Scan box visualization */}
        <div className="relative w-full h-48 border border-border-grey bg-white rounded-md overflow-hidden flex flex-col items-center justify-center mb-6">
          {/* Skeleton lines in background */}
          <div className="w-3/4 h-3 bg-paper rounded mb-2"></div>
          <div className="w-1/2 h-3 bg-paper rounded mb-2"></div>
          <div className="w-2/3 h-3 bg-paper rounded"></div>

          {/* Sweeping scan line */}
          {shouldReduceMotion ? (
            <motion.div
              className="absolute inset-0 bg-signal-blue/10"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
          ) : (
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-signal-blue"
              style={{
                boxShadow: '0 0 8px var(--color-signal-blue)',
                top: 0
              }}
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            />
          )}
        </div>

        <p className="font-sans text-sm text-minor-grey">
          Traversing DOM and running axe-core accessibility checks...
        </p>
      </div>
    </div>
  );
};
export default ScanProgressOverlay;
