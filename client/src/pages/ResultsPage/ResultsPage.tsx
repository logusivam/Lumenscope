import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ScannedURLBar } from '../../components/results/ScannedURLBar';
import { ScoreSummary } from '../../components/results/ScoreSummary';
import { PreviewPanel } from '../../components/results/PreviewPanel';
import { ViolationPanel } from '../../components/results/ViolationPanel';
import { PassedAuditsPanel } from '../../components/results/ViolationPanel/PassedAuditsPanel';
import { ExportBar } from '../../components/results/ExportBar';
import { ScanProgressOverlay } from '../../components/results/ScanProgressOverlay';
import { calculateScore } from '../../lib/scoreCalculator';
import { useScan } from '../../hooks/useScan';
import { AxeResults } from '../../types/axe';

export const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scan, status } = useScan('http://localhost:3001');

  // Load results from navigation state
  const [results, setResults] = useState<AxeResults | null>(location.state?.results || null);
  const [htmlContent, setHtmlContent] = useState<string>(location.state?.html || '');
  const [highlightSelectors, setHighlightSelectors] = useState<string[][] | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'A' | 'AA' | 'AAA' | 'all'>('all');

  useEffect(() => {
    if (!results) {
      navigate('/');
    }
  }, [results, navigate]);

  if (!results) return null;

  const scoreResult = calculateScore(results.violations, results.passes || []);

  const handleRescan = async () => {
    try {
      const { results: newResults, html: newHtml } = await scan(results.url);
      setResults(newResults);
      setHtmlContent(newHtml);
      setHighlightSelectors(null);
    } catch (err) {
      console.error('Re-scan failed:', err);
    }
  };

  const handleHighlight = (selectors: string[]) => {
    setHighlightSelectors([selectors]);
  };

  return (
    <div className="bg-paper min-h-screen flex flex-col">
      {status === 'scanning' && <ScanProgressOverlay url={results.url} />}

      <ScannedURLBar url={results.url} timestamp={results.timestamp} onRescan={handleRescan} />

      <main id="results-dashboard" className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Column - 40% */}
        <div className="w-full lg:w-[40%] flex flex-col gap-6">
          <ScoreSummary
            scoreResult={scoreResult}
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
          />
          <PreviewPanel
            url={results.url}
            htmlContent={htmlContent || `<html><body><div style="padding: 20px; font-family: sans-serif; color: #6B7280;">No raw preview content cached. Perform a scan to view layout.</div></body></html>`}
            highlightSelectors={highlightSelectors}
          />
        </div>

        {/* Right Column - 60% */}
        <div className="w-full lg:w-[60%] flex flex-col">
          <h2 className="font-sans text-lg font-bold text-ink mb-4 flex items-center gap-2">
            Violations
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-border-grey rounded text-minor-grey">
              {results.violations.length} total
            </span>
          </h2>
          <ViolationPanel
            violations={results.violations}
            onHighlight={handleHighlight}
            selectedLevel={selectedLevel}
            highlightSelectors={highlightSelectors}
          />
          <PassedAuditsPanel passes={results.passes || []} />
        </div>
      </main>

      <ExportBar results={results} score={scoreResult.score} />
    </div>
  );
};

export default ResultsPage;
