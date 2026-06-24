import React from 'react';
import { AxeResults } from '../../../types/axe';
import { Download, FileDown, ClipboardCopy } from 'lucide-react';

interface ExportBarProps {
  results: AxeResults;
  score: number;
}

export const ExportBar: React.FC<ExportBarProps> = ({ results, score }) => {
  const handleExportPDF = async () => {
    // Colorspace conversion helpers
    const oklabToRgb = (l: number, a: number, b: number, alpha?: number): string => {
      const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
      const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
      const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

      const l_3 = Math.pow(Math.max(0, l_), 3);
      const m_3 = Math.pow(Math.max(0, m_), 3);
      const s_3 = Math.pow(Math.max(0, s_), 3);

      const x = +1.2270138511 * l_3 - 0.5577999807 * m_3 + 0.2812561489 * s_3;
      const y = -0.0405801784 * l_3 + 1.1122568696 * m_3 - 0.0716766787 * s_3;
      const z = -0.0763812845 * l_3 - 0.4290461323 * m_3 + 1.1503072567 * s_3;

      let r = +3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
      let g = -0.9692660 * x + 1.8760108 * y + 0.0415560 * z;
      let _b = +0.0556434 * x - 0.2040259 * y + 1.0572252 * z;

      const fn = (comp: number) => {
        return comp > 0.0031308 ? 1.055 * Math.pow(comp, 1 / 2.4) - 0.055 : 12.92 * comp;
      };

      r = Math.max(0, Math.min(255, Math.round(fn(r) * 255)));
      g = Math.max(0, Math.min(255, Math.round(fn(g) * 255)));
      _b = Math.max(0, Math.min(255, Math.round(fn(_b) * 255)));

      if (alpha !== undefined) {
        return `rgba(${r}, ${g}, ${_b}, ${alpha})`;
      }
      return `rgb(${r}, ${g}, ${_b})`;
    };

    const oklchToRgb = (l: number, c: number, h: number, alpha?: number): string => {
      const hRad = (h * Math.PI) / 180;
      const a = c * Math.cos(hRad);
      const b = c * Math.sin(hRad);
      return oklabToRgb(l, a, b, alpha);
    };

    const convertOklchAndOklab = (css: string): string => {
      let result = css.replace(/oklch\(([^)]+)\)/gi, (match, content) => {
        try {
          const parts = content.split(/[\s,/]+/).filter(Boolean);
          if (parts[0] === 'from') {
            return 'rgb(45, 91, 255)'; // theme accent fallback for relative color
          }
          if (parts.length >= 3) {
            const l = parts[0].endsWith('%') ? parseFloat(parts[0]) / 100 : parseFloat(parts[0]);
            const c = parseFloat(parts[1]);
            const h = parseFloat(parts[2]);
            const a = parts[3] ? (parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3])) : undefined;
            if (!isNaN(l) && !isNaN(c) && !isNaN(h)) {
              return oklchToRgb(l, c, h, a);
            }
          }
        } catch (e) {}
        return 'rgb(45, 91, 255)';
      });

      result = result.replace(/oklab\(([^)]+)\)/gi, (match, content) => {
        try {
          const parts = content.split(/[\s,/]+/).filter(Boolean);
          if (parts[0] === 'from') {
            return 'rgb(75, 85, 99)'; // neutral fallback
          }
          if (parts.length >= 3) {
            const l = parts[0].endsWith('%') ? parseFloat(parts[0]) / 100 : parseFloat(parts[0]);
            const aVal = parseFloat(parts[1]);
            const bVal = parseFloat(parts[2]);
            const a = parts[3] ? (parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3])) : undefined;
            if (!isNaN(l) && !isNaN(aVal) && !isNaN(bVal)) {
              return oklabToRgb(l, aVal, bVal, a);
            }
          }
        } catch (e) {}
        return 'rgb(75, 85, 99)';
      });

      return result;
    };

    // Save original stylesheet disabled states and reconstruct combined CSS
    const sheetsToRestore: { sheet: CSSStyleSheet; disabled: boolean }[] = [];
    const tempStyles: HTMLStyleElement[] = [];
    let combinedCss = '';

    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        if (sheet.cssRules) {
          const rulesText = Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join('\n');
          combinedCss += '\n' + rulesText;
          sheetsToRestore.push({ sheet, disabled: sheet.disabled });
          sheet.disabled = true;
        }
      } catch (e) {
        // Cross-origin sheets or security boundaries - disable them to prevent html2canvas parsing errors
        try {
          sheetsToRestore.push({ sheet, disabled: sheet.disabled });
          sheet.disabled = true;
        } catch (e2) {}
      }
    });

    // Clean combined CSS
    combinedCss = convertOklchAndOklab(combinedCss);

    // Create a temporary stylesheet containing the converted styles
    const tempStyle = document.createElement('style');
    tempStyle.innerHTML = combinedCss;
    document.head.appendChild(tempStyle);
    tempStyles.push(tempStyle);

    const element = document.getElementById('results-dashboard');
    const inlineStyleElements: { el: HTMLElement; originalStyle: string }[] = [];
    if (element) {
      const allDashboardEls = Array.from(element.querySelectorAll('*')) as HTMLElement[];
      allDashboardEls.forEach((el) => {
        if (el.getAttribute && el.getAttribute('style')) {
          const original = el.getAttribute('style') || '';
          if (original.includes('oklch') || original.includes('oklab')) {
            inlineStyleElements.push({ el, originalStyle: original });
            el.setAttribute('style', convertOklchAndOklab(original));
          }
        }
      });
    }

    // Dynamic import of html2pdf.js client-side only
    const html2pdfModule = await import('html2pdf.js');
    if (!element) {
      // Restore styles in case of missing target
      sheetsToRestore.forEach(({ sheet, disabled }) => {
        try {
          sheet.disabled = disabled;
        } catch (e) {}
      });
      tempStyles.forEach((el) => el.remove());
      inlineStyleElements.forEach(({ el, originalStyle }) => {
        el.setAttribute('style', originalStyle);
      });
      return;
    }

    const opt = {
      margin: 10,
      filename: `lumenscope-report-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    try {
      await html2pdfModule.default().from(element).set(opt).save();
    } catch (pdfErr) {
      console.error('PDF export failed:', pdfErr);
    } finally {
      // Restore styles after rendering finishes
      sheetsToRestore.forEach(({ sheet, disabled }) => {
        try {
          sheet.disabled = disabled;
        } catch (e) {}
      });
      tempStyles.forEach((el) => el.remove());
      inlineStyleElements.forEach(({ el, originalStyle }) => {
        el.setAttribute('style', originalStyle);
      });
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
        className="px-4 py-2 bg-signal-blue text-white rounded font-sans text-xs font-semibold hover:bg-opacity-90 active:bg-opacity-95 focus:outline-none focus:ring-2 focus:ring-signal-blue flex items-center gap-1.5 transition-all"
      >
        <FileDown className="w-4 h-4" />
        Export PDF
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
export default ExportBar;
