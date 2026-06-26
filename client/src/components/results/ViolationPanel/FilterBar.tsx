import React from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  severityFilter: string;
  onSeverityFilterChange: (val: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  severityFilter,
  onSeverityFilterChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-white border border-border-grey rounded-md p-4 mb-4">
      {/* Search Input */}
      <div className="relative flex-grow">
        <label htmlFor="search-violations" className="sr-only">
          Search violations
        </label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-minor-grey" aria-hidden="true" />
        </div>
        <input
          id="search-violations"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search issues by rule ID, help or HTML..."
          className="w-full pl-9 pr-4 py-2 border border-border-grey rounded bg-paper/20 focus:outline-none focus:ring-2 focus:ring-signal-blue text-sm text-ink placeholder-minor-grey"
        />
      </div>

      {/* Severity Selector */}
      <div className="shrink-0 flex gap-2 items-center">
        <label htmlFor="severity-select" className="text-xs font-bold text-ink uppercase tracking-wider">
          Impact
        </label>
        <select
          id="severity-select"
          value={severityFilter}
          onChange={(e) => onSeverityFilterChange(e.target.value)}
          className="px-3 py-2 border border-border-grey rounded bg-white focus:outline-none focus:ring-2 focus:ring-signal-blue text-sm font-medium text-ink cursor-pointer"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="serious">Serious</option>
          <option value="moderate">Moderate</option>
          <option value="minor">Minor</option>
        </select>
      </div>
    </div>
  );
};
export default FilterBar;
