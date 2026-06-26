import React from 'react';
import { OverallScoreGauge } from './OverallScoreGauge';
import { POURBreakdown } from './POURBreakdown';
import { WCAGLevelTabs } from './WCAGLevelTabs';
import { ScoreResult } from '../../../types/score';

interface ScoreSummaryProps {
  scoreResult: ScoreResult;
  selectedLevel: 'A' | 'AA' | 'AAA' | 'all';
  onSelectLevel: (level: 'A' | 'AA' | 'AAA' | 'all') => void;
  totalTestsRun: number;
}

export const ScoreSummary: React.FC<ScoreSummaryProps> = ({
  scoreResult,
  selectedLevel,
  onSelectLevel,
  totalTestsRun
}) => {
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
      <div className="border-t border-border-grey/60 pt-4 flex justify-between items-center text-xs">
        <span className="font-sans font-semibold text-minor-grey">Total Audits Evaluated</span>
        <span className="font-mono font-bold text-ink bg-paper px-2.5 py-1 rounded border border-border-grey/30">
          {totalTestsRun} rules
        </span>
      </div>
    </div>
  );
};
export default ScoreSummary;
