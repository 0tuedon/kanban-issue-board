import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssueStore } from '../store/issueStore';
import './RecentlyAccessedSidebar.css';

export const RecentlyAccessedSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { recentlyAccessedIds, issues } = useIssueStore();

  const recentIssues = recentlyAccessedIds
    .map(id => issues.find(issue => issue.id === id))
    .filter(Boolean);

  if (recentIssues.length === 0) return null;

  return (
    <div className="recently-accessed-sidebar">
      <h3 className="sidebar-title">Recently Accessed</h3>
      <div className="recent-issues-list">
        {recentIssues.map(issue => (
          <div
            key={issue!.id}
            className="recent-issue-item"
            onClick={() => navigate(`/issue/${issue!.id}`)}
          >
            <span className="recent-issue-id">#{issue!.id}</span>
            <span className="recent-issue-title">{issue!.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
