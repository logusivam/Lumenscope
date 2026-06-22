import React from 'react';
import { OverallScoreGauge } from './OverallScoreGauge';
import { POURBreakdown } from './POURBreakdown';
import { WCAGLevelTabs } from './WCAGLevelTabs';
import { ScoreResult } from '../../../types/score';

interface ScoreSummaryProps {
  scoreResult: ScoreResult;
  selectedLevel: 'A' | 'AA' | 'AAA' | 'all';
  onSelectLevel: (level: 'A' | 'AA' | 'AAA' | 'all') => void;
}

export const ScoreSummary: React.FC<ScoreSummaryProps> = ({
  scoreResult,
  selectedLevel,
  onSelectLevel
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
    </div>
  );
};
export default ScoreSummary;
