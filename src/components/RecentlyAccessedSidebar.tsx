import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssueStore } from '../store/issueStore';
import './RecentlyAccessedSidebar.css';

export const RecentlyAccessedSidebar: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const recentlyAccessedIds = useIssueStore(state => state.recentlyAccessedIds);
  const issues = useIssueStore(state => state.issues);

  const recentIssues = useMemo(
    () => recentlyAccessedIds
      .map(id => issues.find(issue => issue.id === id))
      .filter(Boolean),
    [recentlyAccessedIds, issues]
  );

  if (recentIssues.length === 0) return null;

  const handleKeyDown = (issueId: string) => (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigate(`/issue/${issueId}`);
    }
  };

  return (
    <aside className="recently-accessed-sidebar" aria-label="Recently accessed issues">
      <h3 className="sidebar-title">Recently Accessed</h3>
      <div className="recent-issues-list">
        {recentIssues.map(issue => (
          <div
            key={issue!.id}
            className="recent-issue-item"
            onClick={() => navigate(`/issue/${issue!.id}`)}
            onKeyDown={handleKeyDown(issue!.id)}
            role="button"
            tabIndex={0}
            aria-label={`Go to issue ${issue!.id}: ${issue!.title}`}
          >
            <span className="recent-issue-id">#{issue!.id}</span>
            <span className="recent-issue-title">{issue!.title}</span>
          </div>
        ))}
      </div>
    </aside>
  );
});
