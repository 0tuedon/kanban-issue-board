import React, { useState, useEffect } from 'react';
import { useIssueStore } from '../store/issueStore';
import './SyncStatus.css';

export const SyncStatus: React.FC = () => {
  const lastSyncTime = useIssueStore(state => state.lastSyncTime);
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    if (!lastSyncTime) return;

    const updateSecondsAgo = () => {
      const diff = Math.floor((Date.now() - lastSyncTime) / 1000);
      setSecondsAgo(diff);
    };

    updateSecondsAgo();
    const interval = setInterval(updateSecondsAgo, 1000);

    return () => clearInterval(interval);
  }, [lastSyncTime]);

  if (!lastSyncTime) return null;

  return (
    <div className="sync-status">
      <span className="sync-text">
        Last synced {secondsAgo === 0 ? 'just now' : `${secondsAgo}s ago`}
      </span>
    </div>
  );
};
