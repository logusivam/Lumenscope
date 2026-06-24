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
      return css
        .replace(/oklch\(\s*([0-9.]+%?)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+%?))?\s*\)/gi, (match, l, c, h, a) => {
          const lVal = l.endsWith('%') ? parseFloat(l) / 100 : parseFloat(l);
          const cVal = parseFloat(c);
          const hVal = parseFloat(h);
          const aVal = a ? (a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a)) : undefined;
          return oklchToRgb(lVal, cVal, hVal, aVal);
        })
        .replace(/oklab\(\s*([0-9.]+%?)\s+([0-9.-]+)\s+([0-9.-]+)(?:\s*\/\s*([0-9.]+%?))?\s*\)/gi, (match, l, aVal, bVal, a) => {
          const lVal = l.endsWith('%') ? parseFloat(l) / 100 : parseFloat(l);
          const aNum = parseFloat(aVal);
          const bNum = parseFloat(bVal);
          const aVal2 = a ? (a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a)) : undefined;
          return oklabToRgb(lVal, aNum, bNum, aVal2);
        });
    };

    // Save and prepare styles
    const styleElements = Array.from(document.querySelectorAll('style'));
    const originalStyles = styleElements.map((el) => el.innerHTML);

    const linkElements = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
    const tempStyles: HTMLStyleElement[] = [];

    // Process link stylesheets by fetching and converting
    await Promise.all(
      linkElements.map(async (link) => {
        try {
          const res = await fetch(link.href);
          if (res.ok) {
            let cssText = await res.text();
            cssText = convertOklchAndOklab(cssText);
            const tempStyle = document.createElement('style');
            tempStyle.innerHTML = cssText;
            document.head.appendChild(tempStyle);
            tempStyles.push(tempStyle);
            link.disabled = true;
          }
        } catch (err) {
          console.warn('Failed to fetch stylesheet for PDF conversion', err);
        }
      })
    );

    // Convert local style tags
    styleElements.forEach((el) => {
      el.innerHTML = convertOklchAndOklab(el.innerHTML);
    });

    // Dynamic import of html2pdf.js client-side only
    const html2pdfModule = await import('html2pdf.js');
    const element = document.getElementById('results-dashboard');
    if (!element) {
      // Restore styles in case of missing target
      styleElements.forEach((el, index) => {
        el.innerHTML = originalStyles[index];
      });
      linkElements.forEach((link) => {
        link.disabled = false;
      });
      tempStyles.forEach((el) => el.remove());
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
      styleElements.forEach((el, index) => {
        el.innerHTML = originalStyles[index];
      });
      linkElements.forEach((link) => {
        link.disabled = false;
      });
      tempStyles.forEach((el) => el.remove());
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
