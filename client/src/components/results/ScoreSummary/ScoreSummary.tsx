import React from 'react';
import { OverallScoreGauge } from './OverallScoreGauge';
import { POURBreakdown } from './POURBreakdown';
import { WCAGLevelTabs } from './WCAGLevelTabs';
import { ScoreResult } from '../../../types/score';
import { CheckCircle, XCircle, AlertTriangle, MinusCircle } from 'lucide-react';

interface ScoreSummaryProps {
  scoreResult: ScoreResult;
  selectedLevel: 'A' | 'AA' | 'AAA' | 'all';
  onSelectLevel: (level: 'A' | 'AA' | 'AAA' | 'all') => void;
  passedCount: number;
  violatedCount: number;
  incompleteCount: number;
  inapplicableCount: number;
}

export const ScoreSummary: React.FC<ScoreSummaryProps> = ({
  scoreResult,
  selectedLevel,
  onSelectLevel,
  passedCount,
  violatedCount,
  incompleteCount,
  inapplicableCount
}) => {
  const totalRulesChecked = passedCount + violatedCount + incompleteCount + inapplicableCount;

  return (
    <div className="bg-white border border-border-grey rounded-md p-6 flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="font-sans text-sm font-bold text-ink uppercase tracking-wider mb-2">Accessibility Health</h2>
          <OverallScoreGauge score={scoreResult.score} />
        </div>
        <div>
          <h2 className="font-sans text-sm font-bold text-ink uppercase tracking-wider mb-2">POUR breakdown</h2>
          <POURBreakdown scores={scoreResult.pour} />
        </div>
      </div>
      <div>
        <h2 className="font-sans text-sm font-bold text-ink uppercase tracking-wider mb-3">WCAG level filter</h2>
        <WCAGLevelTabs counts={scoreResult.wcag} selectedLevel={selectedLevel} onSelectLevel={onSelectLevel} />
      </div>

      {/* Audit Breakdown */}
      <div className="border-t border-border-grey/60 pt-4">
        <div className="flex justify-between items-center mb-3">
          <span className="font-sans text-sm font-semibold text-ink">Audit Breakdown</span>
          <span className="font-mono text-xs font-bold text-ink bg-paper px-2.5 py-1 rounded border border-border-grey/30">
            {totalRulesChecked} rules checked
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="flex items-center gap-2 bg-severity-pass/10 rounded px-3 py-2">
            <CheckCircle className="w-4 h-4 text-severity-pass-text shrink-0" />
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-severity-pass-text">{passedCount}</span>
              <span className="font-sans text-[10px] uppercase font-bold text-severity-pass-text/70 tracking-wider">Passed</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-severity-critical/10 rounded px-3 py-2">
            <XCircle className="w-4 h-4 text-severity-critical-text shrink-0" />
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-severity-critical-text">{violatedCount}</span>
              <span className="font-sans text-[10px] uppercase font-bold text-severity-critical-text/70 tracking-wider">Violated</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-severity-moderate/10 rounded px-3 py-2">
            <AlertTriangle className="w-4 h-4 text-severity-moderate-text shrink-0" />
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-severity-moderate-text">{incompleteCount}</span>
              <span className="font-sans text-[10px] uppercase font-bold text-severity-moderate-text/70 tracking-wider">Incomplete</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-border-grey/30 rounded px-3 py-2">
            <MinusCircle className="w-4 h-4 text-minor-grey shrink-0" />
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-minor-grey">{inapplicableCount}</span>
              <span className="font-sans text-[10px] uppercase font-bold text-minor-grey/70 tracking-wider">N/A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ScoreSummary;
