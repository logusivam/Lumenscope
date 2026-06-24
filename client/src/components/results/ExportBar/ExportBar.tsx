import React, { useState } from 'react';
import { AxeResults } from '../../../types/axe';
import { Download, FileDown, ClipboardCopy, Loader2 } from 'lucide-react';

interface ExportBarProps {
  results: AxeResults;
  score: number;
}

export const ExportBar: React.FC<ExportBarProps> = ({ results, score }) => {
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    if (exporting) return;
    setExporting(true);

    try {
      const element = document.getElementById('results-dashboard');
      if (!element) {
        console.error('PDF export: #results-dashboard element not found');
        setExporting(false);
        return;
      }

      // Deep-clone the element so we don't affect the live page
      const clone = element.cloneNode(true) as HTMLElement;

      // Inline all computed styles onto each element in the clone
      // This bypasses html2canvas's CSS stylesheet parsing entirely
      const sourceElements = element.querySelectorAll('*');
      const cloneElements = clone.querySelectorAll('*');

      // Also inline styles for the root clone element itself
      const rootComputedStyle = window.getComputedStyle(element);
      const rootCssText = buildInlineStyle(rootComputedStyle);
      clone.setAttribute('style', rootCssText);

      for (let i = 0; i < sourceElements.length; i++) {
        const srcEl = sourceElements[i] as HTMLElement;
        const clnEl = cloneElements[i] as HTMLElement;
        if (!srcEl || !clnEl) continue;

        try {
          const computed = window.getComputedStyle(srcEl);
          const inlineCss = buildInlineStyle(computed);
          clnEl.setAttribute('style', inlineCss);
        } catch (e) {
          // Skip elements where getComputedStyle fails (SVGs, etc.)
        }
      }

      // Remove canvas/iframe/video elements that can't be rendered
      clone.querySelectorAll('iframe, video, object, embed').forEach(el => el.remove());

      // Create an offscreen container to hold the clone
      const offscreen = document.createElement('div');
      offscreen.style.position = 'fixed';
      offscreen.style.top = '-9999px';
      offscreen.style.left = '-9999px';
      offscreen.style.width = element.scrollWidth + 'px';
      offscreen.style.zIndex = '-1';
      offscreen.style.background = '#F7F7F5';
      offscreen.appendChild(clone);
      document.body.appendChild(offscreen);

      // Dynamically import html2pdf
      const html2pdfModule = await import('html2pdf.js');

      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `lumenscope-report-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          // Tell html2canvas to NOT parse any external stylesheets
          // since all styles are already inlined
          ignoreElements: (el: HTMLElement) => {
            return el.tagName === 'LINK' && el.getAttribute('rel') === 'stylesheet';
          },
        },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
      };

      await html2pdfModule.default().from(clone).set(opt).save();

      // Clean up
      document.body.removeChild(offscreen);
    } catch (pdfErr) {
      console.error('PDF export failed:', pdfErr);
      alert('PDF export encountered an error. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `lumenscope-raw-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleCopySummary = () => {
    const summaryText = `Lumenscope Accessibility Report
URL: ${results.url}
Score: ${score}/100
Violations Count: ${results.violations.length}
Generated: ${new Date(results.timestamp).toLocaleString()}`;
    
    navigator.clipboard.writeText(summaryText).then(() => {
      alert('Report summary copied to clipboard!');
    });
  };

  return (
    <div className="bg-white border-t border-border-grey px-6 py-4 flex flex-wrap items-center justify-center gap-4 no-print shadow-sm sticky bottom-0 z-20">
      <button
        onClick={handleExportPDF}
        disabled={exporting}
        className="px-4 py-2 bg-signal-blue text-white rounded font-sans text-xs font-semibold hover:bg-opacity-90 active:bg-opacity-95 focus:outline-none focus:ring-2 focus:ring-signal-blue flex items-center gap-1.5 transition-all disabled:opacity-60"
      >
        {exporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileDown className="w-4 h-4" />
        )}
        {exporting ? 'Exporting…' : 'Export PDF'}
      </button>
      <button
        onClick={handleExportJSON}
        className="px-4 py-2 bg-white text-ink border border-border-grey rounded font-sans text-xs font-semibold hover:bg-paper/40 focus:outline-none focus:ring-2 focus:ring-signal-blue flex items-center gap-1.5 transition-all"
      >
        <Download className="w-4 h-4" />
        Export JSON
      </button>
      <button
        onClick={handleCopySummary}
        className="px-4 py-2 bg-white text-ink border border-border-grey rounded font-sans text-xs font-semibold hover:bg-paper/40 focus:outline-none focus:ring-2 focus:ring-signal-blue flex items-center gap-1.5 transition-all"
      >
        <ClipboardCopy className="w-4 h-4" />
        Copy Summary
      </button>
    </div>
  );
};

/**
 * Build a compact inline style string from a CSSStyleDeclaration.
 * Only includes properties that differ from defaults to keep the string manageable.
 * Also converts any oklab/oklch color values to rgb fallbacks.
 */
function buildInlineStyle(computed: CSSStyleDeclaration): string {
  // Key visual properties to capture
  const props = [
    'display', 'position', 'top', 'right', 'bottom', 'left',
    'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
    'border-radius', 'border-color', 'border-width', 'border-style',
    'background', 'background-color', 'background-image', 'background-size',
    'background-position', 'background-repeat',
    'color', 'font-family', 'font-size', 'font-weight', 'font-style',
    'line-height', 'letter-spacing', 'text-align', 'text-decoration',
    'text-transform', 'white-space', 'word-break', 'overflow-wrap',
    'overflow', 'overflow-x', 'overflow-y',
    'opacity', 'visibility',
    'flex', 'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis',
    'justify-content', 'align-items', 'align-self', 'gap', 'row-gap', 'column-gap',
    'grid-template-columns', 'grid-template-rows', 'grid-column', 'grid-row',
    'box-shadow', 'text-shadow',
    'z-index', 'cursor',
    'transform', 'transition',
    'box-sizing',
    'vertical-align',
    'list-style', 'list-style-type',
    'fill', 'stroke',
    'clip-path',
    'object-fit', 'object-position',
  ];

  const parts: string[] = [];
  for (const prop of props) {
    try {
      const val = computed.getPropertyValue(prop);
      if (val && val !== '' && val !== 'initial' && val !== 'normal' && val !== 'none' && val !== 'auto') {
        // Convert any residual oklab/oklch references to safe values
        let safeVal = val;
        if (val.includes('oklab') || val.includes('oklch')) {
          safeVal = convertModernColors(val);
        }
        parts.push(`${prop}: ${safeVal}`);
      }
    } catch (e) {
      // Skip unreadable properties
    }
  }
  return parts.join('; ');
}

/**
 * Simple fallback converter for any oklab/oklch color strings
 * that getComputedStyle might return.
 */
function convertModernColors(css: string): string {
  // Replace oklch(...) and oklab(...) with a neutral fallback
  return css
    .replace(/oklch\([^)]*\)/gi, 'rgb(107, 114, 128)')
    .replace(/oklab\([^)]*\)/gi, 'rgb(107, 114, 128)');
}

export default ExportBar;
