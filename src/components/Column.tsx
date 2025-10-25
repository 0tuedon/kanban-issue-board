import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { IssueCard } from './IssueCard';
import { Issue, IssueStatus } from '../types';
import { getColumnColor } from '../utils/colors';
import classNames from 'classnames';
import './Column.css';

interface ColumnProps {
  status: IssueStatus;
  issues: Issue[];
}

export const Column: React.FC<ColumnProps> = React.memo(({ status, issues }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div className="column">
      <div className="column-header" style={{ borderTopColor: getColumnColor(status) }}>
        <h2 className="column-title">{status}</h2>
        <span className="issue-count" aria-label={`${issues.length} issues`}>
          {issues.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={classNames('column-content', {
          'drop-over': isOver,
        })}
        role="region"
        aria-label={`${status} column`}
      >
        {issues.length === 0 ? (
          <div className="empty-state" role="status">
            No issues
          </div>
        ) : (
          issues.map(issue => <IssueCard key={issue.id} issue={issue} />)
        )}
      </div>
    </div>
  );
});
