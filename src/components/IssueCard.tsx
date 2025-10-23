import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Issue } from '../types';
import { currentUser } from '../constants/currentUser';
import classNames from 'classnames';
import './IssueCard.css';

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const navigate = useNavigate();
  const canDrag = currentUser.role === 'admin';

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: issue.id,
    disabled: !canDrag,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.8 : 1,
  };

  const handleClick = () => {
    navigate(`/issue/${issue.id}`);
  };

  const getSeverityColor = (severity: number): string => {
    if (severity >= 3) return '#ef4444';
    if (severity === 2) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={classNames('issue-card', {
        'draggable': canDrag,
        'dragging': isDragging,
      })}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      <div className="issue-card-header">
        <span className="issue-id">#{issue.id}</span>
        <span
          className="severity-badge"
          style={{ backgroundColor: getSeverityColor(issue.severity) }}
        >
          Severity {issue.severity}
        </span>
      </div>

      <h3 className="issue-title">{issue.title}</h3>

      <div className="issue-tags">
        {issue.tags.map(tag => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="issue-footer">
        <span className="assignee">👤 {issue.assignee}</span>
        <span className="priority">{issue.priority}</span>
      </div>
    </div>
  );
};
