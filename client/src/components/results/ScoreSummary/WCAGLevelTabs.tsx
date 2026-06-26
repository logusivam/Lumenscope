import React from 'react';
import { WCAGLevelCounts } from '../../../types/score';

interface WCAGLevelTabsProps {
  counts: WCAGLevelCounts;
  selectedLevel: 'A' | 'AA' | 'AAA' | 'all';
  onSelectLevel: (level: 'A' | 'AA' | 'AAA' | 'all') => void;
}

export const WCAGLevelTabs: React.FC<WCAGLevelTabsProps> = ({ counts, selectedLevel, onSelectLevel }) => {
  const levels: { id: 'A' | 'AA' | 'AAA' | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All Issues', count: counts.A + counts.AA + counts.AAA },
    { id: 'A', label: 'Level A', count: counts.A },
    { id: 'AA', label: 'Level AA', count: counts.AA },
    { id: 'AAA', label: 'Level AAA', count: counts.AAA }
  ];

  return (
    <div className="flex border-b border-border-grey" role="tablist" aria-label="WCAG Levels">
      {levels.map((lvl) => (
        <button
          key={lvl.id}
          role="tab"
          aria-selected={selectedLevel === lvl.id}
          onClick={() => onSelectLevel(lvl.id)}
          className={`flex-1 py-2 px-2 text-center font-sans text-xs font-semibold focus:outline-none transition-all ${
            selectedLevel === lvl.id
              ? 'border-b-2 border-signal-blue text-signal-blue'
              : 'text-minor-grey hover:text-ink'
          }`}
        >
          <span className="block">{lvl.label}</span>
          <span className="font-mono text-sm block mt-0.5">{lvl.count}</span>
        </button>
      ))}
    </div>
  );
};
export default WCAGLevelTabs;
