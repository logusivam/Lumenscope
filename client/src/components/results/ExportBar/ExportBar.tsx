import React from 'react';
import { AxeResults } from '../../../types/axe';
import { Download, FileDown, ClipboardCopy } from 'lucide-react';

interface ExportBarProps {
  results: AxeResults;
  score: number;
}

export const ExportBar: React.FC<ExportBarProps> = ({ results, score }) => {
  const handleExportPDF = () => {
    // Dynamic import of html2pdf.js client-side only
    import('html2pdf.js').then((html2pdfModule) => {
      const element = document.getElementById('results-dashboard');
      if (!element) return;
      
      const opt = {
        margin: 10,
        filename: `lumenscope-report-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdfModule.default().from(element).set(opt).save();
    });
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
