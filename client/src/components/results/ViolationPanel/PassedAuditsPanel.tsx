import React, { useState } from 'react';
import { AxeViolation } from '../../../types/axe';
import { getWcagCriterion, getWcagLevel } from '../../../lib/wcagMapper';
import { ChevronDown, ChevronUp, CheckCircle, Search } from 'lucide-react';

interface PassedAuditsPanelProps {
  passes: AxeViolation[];
}

export const PassedAuditsPanel: React.FC<PassedAuditsPanelProps> = ({ passes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setOpenCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalPassedElements = passes.reduce((acc, rule) => acc + (rule.nodes?.length || 0), 0);

  const filteredPasses = passes.filter((p) => {
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      const matchesId = p.id.toLowerCase().includes(query);
      const matchesHelp = p.help.toLowerCase().includes(query);
      const matchesHtml = p.nodes?.some((node) => node.html.toLowerCase().includes(query));
      return matchesId || matchesHelp || matchesHtml;
    }
    return true;
  });

  return (
    <div className="mt-8 pt-8 border-t border-border-grey/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-sans text-lg font-bold text-ink flex items-center gap-2">
            Passed Checks
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-severity-pass/10 rounded text-severity-pass-text">
              {passes.length} passed
            </span>
          </h2>
          <p className="font-sans text-xs text-minor-grey mt-0.5">
            Accessibility standards successfully met on this page
          </p>
        </div>

        {/* Stats Grid */}
        <div className="flex gap-6">
          <div className="bg-white border border-border-grey rounded px-4 py-2 flex flex-col justify-center min-w-[120px]">
            <span className="font-sans text-[10px] uppercase font-bold text-minor-grey tracking-wider">Passed Audits</span>
            <span className="font-sans text-lg font-bold text-severity-pass-text mt-0.5">{passes.length}</span>
          </div>
          <div className="bg-white border border-border-grey rounded px-4 py-2 flex flex-col justify-center min-w-[120px]">
            <span className="font-sans text-[10px] uppercase font-bold text-minor-grey tracking-wider">Passed Elements</span>
            <span className="font-sans text-lg font-bold text-ink mt-0.5">{totalPassedElements}</span>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-minor-grey" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search passed audits or elements..."
          className="block w-full pl-9 pr-3 py-2 bg-white border border-border-grey rounded-md text-sm font-sans text-ink placeholder-minor-grey focus:outline-none focus:ring-1 focus:ring-signal-blue focus:border-signal-blue"
        />
      </div>

      {/* Passed Cards list */}
      <div className="flex flex-col gap-3">
        {filteredPasses.length === 0 ? (
          <div className="text-center py-6 bg-white border border-border-grey rounded-md text-minor-grey text-sm font-medium">
            No passed audits match your search.
          </div>
        ) : (
          filteredPasses.map((p) => {
            const isOpen = !!openCards[p.id];
            const level = getWcagLevel(p.tags);
            const criterion = getWcagCriterion(p.tags);
            const nodes = p.nodes || [];

            return (
              <div key={p.id} className="border border-border-grey bg-white rounded-md overflow-hidden transition-all">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleCard(p.id)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-paper/40 focus:outline-none focus:ring-2 focus:ring-signal-blue"
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-severity-pass/10 text-severity-pass-text flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      pass
                    </span>
                    <span className="font-mono text-xs font-semibold text-ink break-all">
                      {p.id}
                    </span>
                    {nodes.length > 0 && (
                      <span className="font-sans text-xs text-minor-grey">
                        ({nodes.length} element{nodes.length > 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="font-sans text-xs font-medium text-minor-grey">
                      Level {level}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-minor-grey" /> : <ChevronDown className="w-4 h-4 text-minor-grey" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-border-grey bg-paper/10 flex flex-col gap-4">
                    <div>
                      <h4 className="font-sans text-xs font-bold text-ink uppercase tracking-wider mt-4 mb-1">
                        Description
                      </h4>
                      <p className="font-sans text-sm text-ink leading-relaxed">
                        {p.help}
                      </p>
                    </div>

                    {criterion !== 'N/A' && (
                      <div>
                        <h4 className="font-sans text-xs font-bold text-ink uppercase tracking-wider mb-1">
                          Success Criterion
                        </h4>
                        <a
                          href={p.helpUrl}
                          target="_blank; noreferrer"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-signal-blue hover:underline focus:outline-none focus:underline flex items-center gap-1"
                        >
                          {criterion} &rarr;
                        </a>
                      </div>
                    )}

                    {nodes.length > 0 && (
                      <div>
                        <h4 className="font-sans text-xs font-bold text-ink uppercase tracking-wider mb-2">
                          Passed Elements
                        </h4>
                        <div className="flex flex-col gap-2">
                          {nodes.map((node, idx) => (
                            <div key={idx} className="border border-border-grey bg-white rounded p-3">
                              <pre className="font-mono text-[11px] text-ink bg-paper/50 p-2 rounded overflow-x-auto whitespace-pre-wrap break-all border border-border-grey/30">
                                {node.html}
                              </pre>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default PassedAuditsPanel;
