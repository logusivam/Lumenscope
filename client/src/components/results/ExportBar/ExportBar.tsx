import React, { useState } from 'react';
import { AxeResults } from '../../../types/axe';
import { Download, FileDown, ClipboardCopy, Loader2 } from 'lucide-react';
import logoFullPng from '../../../assets/lumenscope-logo-full@2x.png';

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
      const passed = results.passes?.length || 0;
      const violated = results.violations?.length || 0;
      const incomplete = results.incomplete?.length || 0;
      const inapplicable = results.inapplicable?.length || 0;
      const dateStr = new Date(results.timestamp).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Group violations by impact
      const groupedViolations = {
        critical: results.violations.filter(v => v.impact === 'critical'),
        serious: results.violations.filter(v => v.impact === 'serious'),
        moderate: results.violations.filter(v => v.impact === 'moderate'),
        minor: results.violations.filter(v => v.impact === 'minor' || !v.impact)
      };

      // Split violations into chunks of 3 violations per page to prevent A4 overflow
      const violationsChunks = [];
      const violationsChunkSize = 3;
      for (let i = 0; i < results.violations.length; i += violationsChunkSize) {
        violationsChunks.push(results.violations.slice(i, i + violationsChunkSize));
      }

      // Split passes into chunks of 12 passes per page to prevent A4 overflow
      const passesChunks = [];
      const passesChunkSize = 12;
      for (let i = 0; i < results.passes.length; i += passesChunkSize) {
        passesChunks.push(results.passes.slice(i, i + passesChunkSize));
      }

      let currentPage = 1;

      // Create a programmatic custom HTML layout for PDF printing
      const pdfContainer = document.createElement('div');
      pdfContainer.className = 'pdf-report';
      pdfContainer.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
          
          .pdf-report {
            font-family: 'IBM Plex Sans', -apple-system, sans-serif;
            color: #1A1D23;
            background-color: #FFFFFF;
            font-size: 11px;
            line-height: 1.6;
          }
          .pdf-page {
            position: relative;
            width: 210mm;
            height: 296.2mm;
            padding: 22mm 18mm 25mm 18mm;
            box-sizing: border-box;
            page-break-after: always;
            background-color: #FFFFFF;
          }
          .pdf-page:last-child {
            page-break-after: avoid !important;
          }
          .pdf-header {
            border-bottom: 2px solid #D9D9D6;
            padding-bottom: 10px;
            margin-bottom: 25px;
            overflow: hidden;
          }
          .pdf-header img {
            float: left;
            height: 32px;
            width: auto;
          }
          .pdf-header-title {
            float: right;
            font-size: 10px;
            color: #6B7280;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 8px;
          }
          .pdf-footer {
            position: absolute;
            bottom: 20mm;
            left: 18mm;
            right: 18mm;
            border-top: 1px solid #D9D9D6;
            padding-top: 10px;
            font-size: 9px;
            color: #6B7280;
            line-height: 1.4;
            background-color: #FFFFFF;
          }
          .pdf-footer-left {
            float: left;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .pdf-footer-right {
            float: right;
          }
          
          /* Cover Page */
          .cover-container {
            padding: 50px 20px 0 20px;
            text-align: center;
          }
          .cover-logo {
            display: block;
            height: 56px;
            width: auto;
            margin: 0 auto 35px auto;
          }
          .cover-title {
            font-size: 24px;
            font-weight: 700;
            color: #1A1D23;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
          }
          .cover-subtitle {
            font-size: 13px;
            color: #6B7280;
            margin-bottom: 40px;
          }
          .cover-meta-table {
            width: 100%;
            max-width: 500px;
            margin: 0 auto 40px auto;
            border-collapse: collapse;
          }
          .cover-meta-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #D9D9D6;
            font-size: 11px;
            text-align: left;
          }
          .cover-meta-table td.label {
            font-weight: 600;
            color: #6B7280;
            width: 40%;
          }
          .cover-meta-table td.value {
            color: #1A1D23;
            word-break: break-all;
          }
          .cover-disclaimer {
            font-size: 8.5px;
            color: #6B7280;
            line-height: 1.6;
            text-align: justify;
            background: #FFFFFF;
            border: 1px solid #D9D9D6;
            padding: 18px 20px;
            border-radius: 8px;
            max-width: 600px;
            margin: 0 auto;
          }

          /* Content Styling */
          .stats-grid {
            overflow: hidden;
            margin-bottom: 25px;
          }
          .stat-card {
            float: left;
            width: 23.5%;
            margin-right: 2%;
            border: 1px solid #D9D9D6;
            border-radius: 8px;
            padding: 15px 10px;
            text-align: center;
            box-sizing: border-box;
            background: #FFFFFF;
          }
          .stat-card:last-child {
            margin-right: 0;
          }
          .stat-lbl {
            font-size: 8.5px;
            text-transform: uppercase;
            color: #6B7280;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          .stat-val {
            font-size: 20px;
            font-weight: 700;
            margin-top: 5px;
          }
          .stat-card.passed { border-color: #2F9E5C; color: #1F7A45; background: #EAF7EE; }
          .stat-card.violated { border-color: #D14343; color: #B23030; background: #FDF2F2; }
          .stat-card.incomplete { border-color: #E08A2E; color: #9A5A1A; background: #FEF8F2; }
          .stat-card.na { border-color: #6B7280; color: #6B7280; background: #F3F4F6; }

          .v-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            background: #FFFFFF;
          }
          .v-table th, .v-table td {
            border: 1px solid #D9D9D6;
            padding: 10px 12px;
            text-align: left;
            font-size: 10.5px;
          }
          .v-table th {
            background: #F3F4F6;
            font-weight: 700;
            color: #1A1D23;
          }
          
          /* Violations list */
          .v-card {
            border: 1px solid #D9D9D6;
            border-radius: 8px;
            padding: 18px;
            margin-bottom: 18px;
            background: #FFFFFF;
            page-break-inside: avoid;
          }
          .v-badge {
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            height: 24px;
            line-height: 10px;
            padding: 0 10px;
            border-radius: 4px;
            letter-spacing: 0.5px;
            border-width: 1px;
            border-style: solid;
            display: inline-block;
            text-align: center;
            box-sizing: border-box;
          }
          .v-badge.critical { background: #FDF2F2; color: #B23030; border-color: #FCA5A5; }
          .v-badge.serious { background: #FEF8F2; color: #9A5A1A; border-color: #FCD34D; }
          .v-badge.moderate { background: #EFF6FF; color: #1E40AF; border-color: #93C5FD; }
          .v-badge.minor { background: #F9FAFB; color: #6B7280; border-color: #D1D5DB; }

          .v-desc {
            color: #4B5563;
            font-size: 10.5px;
            margin-bottom: 10px;
            margin-top: 5px;
            clear: both;
          }
          .v-help {
            color: #2D5BFF;
            font-size: 9.5px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            margin-bottom: 12px;
          }
          .node-lbl {
            font-size: 8.5px;
            text-transform: uppercase;
            color: #6B7280;
            font-weight: 700;
            margin-top: 15px;
            margin-bottom: 5px;
            letter-spacing: 0.5px;
          }
          .node-code {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 8.5px;
            background: #F7F7F5;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid #D9D9D6;
            margin-top: 8px;
            color: #1A1D23;
            word-break: break-all;
          }
          
          .passed-grid {
            overflow: hidden;
          }
          .passed-item {
            float: left;
            width: 48%;
            margin-right: 4%;
            margin-bottom: 12px;
            border: 1px solid #D9D9D6;
            border-radius: 6px;
            padding: 10px 12px;
            background: #FFFFFF;
            box-sizing: border-box;
          }
          .passed-item:nth-child(2n) {
            margin-right: 0;
          }
          .passed-id {
            font-weight: 700;
            color: #1F7A45;
            margin-bottom: 4px;
            font-size: 10px;
          }
        </style>

        <!-- PAGE 1: COVER PAGE (No Footer per industry standards) -->
        <div class="pdf-page">
          <div class="cover-container">
            <img src="${logoFullPng}" class="cover-logo" alt="Lumenscope Logo" />
            <h1 class="cover-title">Accessibility Statement</h1>
            <p class="cover-subtitle">Automated Compliance Assessment Report</p>
            
            <table style="margin: 0 auto 40px auto; background: #FFFFFF; border: 1px solid #D9D9D6; border-radius: 12px; padding: 30px 60px; text-align: center; border-collapse: separate;">
              <tr>
                <td style="font-size: 52px; font-weight: 700; color: #2D5BFF; line-height: 1; text-align: center; font-family: 'IBM Plex Sans', sans-serif;">
                  ${score}
                </td>
              </tr>
              <tr>
                <td style="font-size: 9.5px; text-transform: uppercase; letter-spacing: 1.5px; color: #6B7280; font-weight: 700; text-align: center; padding-top: 15px; font-family: 'IBM Plex Sans', sans-serif; line-height: 1.2;">
                  Accessibility Score
                </td>
              </tr>
            </table>

            <table class="cover-meta-table">
              <tr>
                <td class="label">Target Website</td>
                <td class="value">${results.url}</td>
              </tr>
              <tr>
                <td class="label">Analysis Date</td>
                <td class="value">${dateStr}</td>
              </tr>
              <tr>
                <td class="label">Standards Audited</td>
                <td class="value">WCAG 2.1 (Levels A, AA, AAA)</td>
              </tr>
              <tr>
                <td class="label">Audit Engine</td>
                <td class="value">axe-core ${results.violations[0]?.nodes[0]?.any ? 'Engine' : 'Library'}</td>
              </tr>
            </table>

            <div class="cover-disclaimer">
              <p style="margin: 0; padding: 0;"><strong>Disclaimer:</strong> This automated report was compiled by Lumenscope. 
              While automated audits identify critical programmatic violations (such as missing alt-text and structure anomalies), 
              they do not represent a full legal verification of accessibility compliance. A comprehensive manual audit 
              employing screen readers, keyboard-only traversals, and user-testing remains essential for complete WCAG certification.</p>
            </div>
          </div>
        </div>

        <!-- PAGE 2: EXECUTIVE SUMMARY (Page 1 in numbering) -->
        <div class="pdf-page">
          <div class="pdf-header">
            <img src="${logoFullPng}" alt="Lumenscope Logo" />
            <span class="pdf-header-title">Executive Summary</span>
          </div>
          
          <div style="font-size: 14px; font-weight: 700; color: #1A1D23; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.2; font-family: 'IBM Plex Sans', sans-serif; margin-bottom: 18px; margin-top: 15px;"><span style="color: #2D5BFF; margin-right: 8px;">01.</span>Compliance Statistics</div>
          
          <div class="stats-grid">
            <div class="stat-card passed">
              <div class="stat-lbl">Passed</div>
              <div class="stat-val">${passed}</div>
            </div>
            <div class="stat-card violated">
              <div class="stat-lbl">Violated</div>
              <div class="stat-val">${violated}</div>
            </div>
            <div class="stat-card incomplete">
              <div class="stat-lbl">Incomplete</div>
              <div class="stat-val">${incomplete}</div>
            </div>
            <div class="stat-card na">
              <div class="stat-lbl">N/A Rules</div>
              <div class="stat-val">${inapplicable}</div>
            </div>
          </div>

          <div style="font-size: 14px; font-weight: 700; color: #1A1D23; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.2; font-family: 'IBM Plex Sans', sans-serif; margin-bottom: 18px; margin-top: 15px;"><span style="color: #2D5BFF; margin-right: 8px;">02.</span>Violation Level Breakdown</div>
          
          <table class="v-table">
            <thead>
              <tr>
                <th>Impact Level</th>
                <th>Description</th>
                <th>Violated Rules Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: bold; color: #B23030;">Critical</td>
                <td>High barriers that block users from navigating or interacting completely.</td>
                <td style="font-weight: bold; text-align: center;">${groupedViolations.critical.length}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #9A5A1A;">Serious</td>
                <td>Severe obstacles that impede usage or force difficult workarounds.</td>
                <td style="font-weight: bold; text-align: center;">${groupedViolations.serious.length}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #1E40AF;">Moderate</td>
                <td>General accessibility hurdles that create friction.</td>
                <td style="font-weight: bold; text-align: center;">${groupedViolations.moderate.length}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #6B7280;">Minor</td>
                <td>Stylistic or secondary conformance problems.</td>
                <td style="font-weight: bold; text-align: center;">${groupedViolations.minor.length}</td>
              </tr>
            </tbody>
          </table>

          <div class="pdf-footer">
            <span class="pdf-footer-left">logusivam vision</span>
            <span class="pdf-footer-right">Page ${currentPage}</span>
          </div>
        </div>

        <!-- DETAILED VIOLATIONS (Paginated dynamically) -->
        ${violationsChunks.map((chunk) => {
        currentPage++;
        return `
            <div class="pdf-page">
              <div class="pdf-header">
                <img src="${logoFullPng}" alt="Lumenscope Logo" />
                <span class="pdf-header-title">Detailed Violations</span>
              </div>
              
              <div style="font-size: 14px; font-weight: 700; color: #1A1D23; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.2; font-family: 'IBM Plex Sans', sans-serif; margin-bottom: 18px; margin-top: 15px;"><span style="color: #2D5BFF; margin-right: 8px;">03.</span>Detailed Rule Violations</div>
              
              <div style="margin-bottom: 20px;">
                ${chunk.map((v) => `
                  <div class="v-card">
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
                      <tr>
                        <td style="font-weight: 700; font-size: 12px; color: #1A1D23; text-align: left; vertical-align: middle; font-family: 'IBM Plex Sans', sans-serif; line-height: 1.3;">
                          ${v.id}
                        </td>
                        <td style="text-align: right; vertical-align: middle; width: 100px; padding: 0;">
                          <span class="v-badge ${v.impact || 'minor'}">${v.impact || 'minor'}</span>
                        </td>
                      </tr>
                    </table>
                    <div class="v-desc">${v.description}</div>
                    <div><a href="${v.helpUrl}" target="_blank" class="v-help">Help Reference: ${v.help}</a></div>
                    <div class="node-lbl">Impacted Elements (${v.nodes.length})</div>
                    ${v.nodes.slice(0, 2).map((n) => `
                      <div class="node-code">${n.html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                    `).join('')}
                    ${v.nodes.length > 2 ? `<div style="font-size: 8.5px; color: #6B7280; font-style: italic; margin-top: 8px;">+ ${v.nodes.length - 2} more elements found</div>` : ''}
                  </div>
                `).join('')}
              </div>
              
              <div class="pdf-footer">
                <span class="pdf-footer-left">logusivam vision</span>
                <span class="pdf-footer-right">Page ${currentPage}</span>
              </div>
            </div>
          `;
      }).join('')}

        <!-- PASSED AUDITS (Paginated dynamically) -->
        ${passesChunks.map((chunk, idx) => {
        currentPage++;
        return `
            <div class="pdf-page">
              <div class="pdf-header">
                <img src="${logoFullPng}" alt="Lumenscope Logo" />
                <span class="pdf-header-title">Passed Audits</span>
              </div>
              
              <div style="font-size: 14px; font-weight: 700; color: #1A1D23; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.2; font-family: 'IBM Plex Sans', sans-serif; margin-bottom: 18px; margin-top: 15px;"><span style="color: #2D5BFF; margin-right: 8px;">04.</span>Passed Audits list ${passesChunks.length > 1 ? `(Part ${idx + 1})` : ''}</div>
              
              <div class="passed-grid">
                ${chunk.map((p) => `
                  <div class="passed-item">
                    <div class="passed-id">${p.id}</div>
                    <div style="color: #4B5563;">${p.description}</div>
                  </div>
                `).join('')}
              </div>

              <div class="pdf-footer">
                <span class="pdf-footer-left">logusivam vision</span>
                <span class="pdf-footer-right">Page ${currentPage}</span>
              </div>
            </div>
          `;
      }).join('')}
      `;

      // Mount temporary offscreen element
      document.body.appendChild(pdfContainer);

      // Dynamically import html2pdf
      const html2pdfModule = await import('html2pdf.js');

      const opt = {
        margin: 0,
        filename: `lumenscope-accessibility-report-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#FFFFFF'
        },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdfModule.default().from(pdfContainer).set(opt).save();

      // Clean up
      document.body.removeChild(pdfContainer);
    } catch (pdfErr) {
      console.error('PDF export failed:', pdfErr);
      alert('PDF export encountered an error. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `lumenscope-raw-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleCopySummary = () => {
    const passed = results.passes?.length || 0;
    const violated = results.violations?.length || 0;
    const incomplete = results.incomplete?.length || 0;
    const inapplicable = results.inapplicable?.length || 0;
    const totalRules = passed + violated + incomplete + inapplicable;

    const summaryText = `Lumenscope Accessibility Report
URL: ${results.url}
Score: ${score}/100
Violations Count: ${violated}
Passed Audits Count: ${passed}
Total Rules Evaluated: ${totalRules} (Passed: ${passed}, Incomplete: ${incomplete}, Violated: ${violated}, N/A: ${inapplicable})
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

export default ExportBar;

