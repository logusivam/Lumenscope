import React, { useState } from 'react';
import { AxeViolation } from '../../../types/axe';
import { getWcagCriterion, getWcagLevel } from '../../../lib/wcagMapper';
import { ChevronDown, ChevronUp, Highlighter } from 'lucide-react';

interface ViolationCardProps {
  violation: AxeViolation;
  onHighlight: (selector: string[]) => void;
  isHighlighted?: boolean;
}

export const ViolationCard: React.FC<ViolationCardProps> = ({
  violation,
  onHighlight,
  isHighlighted = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const level = getWcagLevel(violation.tags);
  const criterion = getWcagCriterion(violation.tags);

  const getImpactBadgeClass = (impact: string | null) => {
    switch (impact) {
      case 'critical':
        return 'bg-severity-critical text-white';
      case 'serious':
        return 'bg-severity-serious text-white';
      case 'moderate':
        return 'bg-severity-moderate text-ink';
      case 'minor':
      default:
        return 'bg-severity-minor text-white';
    }
  };

  const getImpactTextClass = (impact: string | null) => {
    switch (impact) {
      case 'critical':
        return 'text-severity-critical-text';
      case 'serious':
        return 'text-severity-serious-text';
      case 'moderate':
        return 'text-severity-moderate-text';
      case 'minor':
      default:
        return 'text-severity-minor-text';
    }
  };

  return (
    <div className="border border-border-grey bg-white rounded-md overflow-hidden transition-all">
      {/* Summary Header Trigger */}
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-paper/40 focus:outline-none focus:ring-2 focus:ring-signal-blue"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getImpactBadgeClass(violation.impact)}`}>
            {violation.impact || 'minor'}
          </span>
          <span className="font-mono text-xs font-semibold text-ink break-all">
            {violation.id}
          </span>
          <span className="font-sans text-xs text-minor-grey">
            ({violation.nodes.length} affected)
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="font-sans text-xs font-medium text-minor-grey">
            Level {level}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-minor-grey" /> : <ChevronDown className="w-4 h-4 text-minor-grey" />}
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="px-5 pb-5 border-t border-border-grey bg-paper/10 flex flex-col gap-4">
          <div>
            <h4 className="font-sans text-xs font-bold text-ink uppercase tracking-wider mt-4 mb-1">
              Description
            </h4>
            <p className="font-sans text-sm text-ink leading-relaxed">
              {violation.help}
            </p>
          </div>

          <div>
            <h4 className="font-sans text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Success Criterion
            </h4>
            <a
              href={violation.helpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-signal-blue hover:underline focus:outline-none focus:underline flex items-center gap-1"
            >
              {criterion} &rarr;
            </a>
          </div>

          <div>
            <h4 className="font-sans text-xs font-bold text-ink uppercase tracking-wider mb-2">
              Affected Elements & Fixes
            </h4>
            <div className="flex flex-col gap-3">
              {violation.nodes.map((node, idx) => (
                <div key={idx} className="border border-border-grey bg-white rounded p-3 flex flex-col gap-2">
                  <pre className="font-mono text-[11px] text-ink bg-paper/50 p-2 rounded overflow-x-auto whitespace-pre-wrap break-all border border-border-grey/30">
                    {node.html}
                  </pre>
                  {node.failureSummary && (
                    <div className="text-xs text-minor-grey">
                      <strong className={getImpactTextClass(violation.impact)}>Fix Recommendation:</strong>
                      <p className="mt-1 leading-relaxed">{node.failureSummary}</p>
                    </div>
                  )}
                  {node.target && node.target.length > 0 && (
                    <button
                      type="button"
                      onClick={() => onHighlight(node.target)}
                      className={`mt-1 self-start px-3 py-1 text-xs font-semibold rounded flex items-center gap-1.5 transition-all border focus:outline-none focus:ring-2 focus:ring-signal-blue ${
                        isHighlighted
                          ? 'bg-signal-blue text-white border-signal-blue'
                          : 'bg-white text-signal-blue border-border-grey hover:bg-paper/40'
                      }`}
                    >
                      <Highlighter className="w-3.5 h-3.5" />
                      Highlight element
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ViolationCard;
