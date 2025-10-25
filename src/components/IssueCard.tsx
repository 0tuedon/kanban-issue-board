import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Issue } from '../types';
import { currentUser } from '../constants/currentUser';
import { getSeverityColor } from '../utils/colors';
import classNames from 'classnames';
import './IssueCard.css';

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard: React.FC<IssueCardProps> = React.memo(({ issue }) => {
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigate(`/issue/${issue.id}`);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={classNames('issue-card', {
        'draggable': canDrag,
        'dragging': isDragging,
      })}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Issue ${issue.id}: ${issue.title}`}
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
});
