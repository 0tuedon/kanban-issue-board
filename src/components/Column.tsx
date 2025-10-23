import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { IssueCard } from './IssueCard';
import { Issue, IssueStatus } from '../types';
import classNames from 'classnames';
import './Column.css';

interface ColumnProps {
  status: IssueStatus;
  issues: Issue[];
}

export const Column: React.FC<ColumnProps> = ({ status, issues }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  const getColumnColor = (status: IssueStatus): string => {
    switch (status) {
      case 'Backlog':
        return '#6b7280';
      case 'In Progress':
        return '#3b82f6';
      case 'Done':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="column">
      <div className="column-header" style={{ borderTopColor: getColumnColor(status) }}>
        <h2 className="column-title">{status}</h2>
        <span className="issue-count">{issues.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={classNames('column-content', {
          'drop-over': isOver,
        })}
      >
        {issues.length === 0 ? (
          <div className="empty-state">No issues</div>
        ) : (
          issues.map(issue => <IssueCard key={issue.id} issue={issue} />)
        )}
      </div>
    </div>
  );
};
