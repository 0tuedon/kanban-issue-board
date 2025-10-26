import React, { useMemo } from 'react';
import { useIssueStore } from '../store/issueStore';
import './FilterControls.css';

export const FilterControls: React.FC = React.memo(() => {
  const issues = useIssueStore(state => state.issues);
  const filters = useIssueStore(state => state.filters);
  const setAssigneeFilter = useIssueStore(state => state.setAssigneeFilter);
  const setSeverityFilter = useIssueStore(state => state.setSeverityFilter);
  const resetFilters = useIssueStore(state => state.resetFilters);

  const uniqueAssignees = useMemo(
    () => Array.from(new Set(issues.map(issue => issue.assignee))).sort(),
    [issues]
  );

  const severityLevels = [1, 2, 3];

  const hasActiveFilters = filters.assigneeFilter || filters.severityFilter !== null || filters.searchQuery;

  return (
    <div className="filter-controls">
      <div className="filter-group">
        <label htmlFor="assignee-filter" className="filter-label">
          Assignee:
        </label>
        <select
          id="assignee-filter"
          value={filters.assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All</option>
          {uniqueAssignees.map(assignee => (
            <option key={assignee} value={assignee}>
              {assignee}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="severity-filter" className="filter-label">
          Severity:
        </label>
        <select
          id="severity-filter"
          value={filters.severityFilter ?? ''}
          onChange={(e) => setSeverityFilter(e.target.value ? parseInt(e.target.value) : null)}
          className="filter-select"
        >
          <option value="">All</option>
          {severityLevels.map(level => (
            <option key={level} value={level}>
              Level {level}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="reset-filters-button"
          title="Clear all filters"
        >
          ✕ Reset
        </button>
      )}
    </div>
  );
});
