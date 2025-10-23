import React from 'react';
import { useIssueStore } from '../store/issueStore';
import './FilterControls.css';

export const FilterControls: React.FC = () => {
  const { issues, filters, setAssigneeFilter, setSeverityFilter } = useIssueStore();

  const uniqueAssignees = Array.from(new Set(issues.map(issue => issue.assignee))).sort();

  const severityLevels = [1, 2, 3];

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
    </div>
  );
};
