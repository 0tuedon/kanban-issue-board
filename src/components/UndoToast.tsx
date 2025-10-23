import React from 'react';
import { useIssueStore } from '../store/issueStore';
import './UndoToast.css';

export const UndoToast: React.FC = () => {
  const { undoState, undoUpdate } = useIssueStore();

  if (!undoState) return null;

  return (
    <div className="undo-toast">
      <span className="undo-message">Issue Updated</span>
      <button onClick={undoUpdate} className="undo-button">
        Undo
      </button>
    </div>
  );
};
