import React, { useState } from 'react';
import { AxeViolation } from '../../../types/axe';
import { FilterBar } from './FilterBar';
import { ViolationCard } from './ViolationCard';
import { getWcagLevel } from '../../../lib/wcagMapper';

interface ViolationPanelProps {
  violations: AxeViolation[];
  onHighlight: (selector: string[]) => void;
  selectedLevel: 'A' | 'AA' | 'AAA' | 'all';
  highlightSelectors?: string[][] | null;
}

const SEVERITY_ORDER: Record<string, number> = {
  critical: 4,
  serious: 3,
  moderate: 2,
  minor: 1
};

export const ViolationPanel: React.FC<ViolationPanelProps> = ({
  violations,
  onHighlight,
  selectedLevel,
  highlightSelectors = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredViolations = violations
    .filter((v) => {
      // 1. Filter by WCAG level
      const level = getWcagLevel(v.tags);
      if (selectedLevel !== 'all' && level !== selectedLevel) {
        return false;
      }
      
      // 2. Filter by severity
      const impact = v.impact || 'minor';
      if (severityFilter !== 'all' && impact !== severityFilter) {
        return false;
      }
      
      // 3. Filter by search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesId = v.id.toLowerCase().includes(query);
        const matchesHelp = v.help.toLowerCase().includes(query);
        const matchesHtml = v.nodes.some((node) => node.html.toLowerCase().includes(query));
        return matchesId || matchesHelp || matchesHtml;
      }
      return true;
    })
    .sort((a, b) => {
      const orderA = SEVERITY_ORDER[a.impact || 'minor'] || 0;
      const orderB = SEVERITY_ORDER[b.impact || 'minor'] || 0;
      return orderB - orderA;
    });

  return (
    <div>
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        severityFilter={severityFilter}
        onSeverityFilterChange={setSeverityFilter}
      />
      <div className="flex flex-col gap-4">
        {filteredViolations.length === 0 ? (
          <div className="text-center py-8 bg-white border border-border-grey rounded-md text-minor-grey text-sm font-medium">
            No accessibility violations match the selected filters.
          </div>
        ) : (
          filteredViolations.map((v) => (
            <ViolationCard
              key={v.id}
              violation={v}
              onHighlight={onHighlight}
              highlightSelectors={highlightSelectors}
            />
          ))
        )}
      </div>
    </div>
  );
};
export default ViolationPanel;
