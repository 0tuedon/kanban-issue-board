import  { useEffect, useMemo } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useIssueStore } from '../store/issueStore';
import { filterAndSortIssues } from '../utils/sorting';
import { IssueStatus, ProgressStatus } from '../types';
import { currentUser } from '../constants/currentUser';
import { Column } from '../components/Column';
import { SearchBar } from '../components/SearchBar';
import { FilterControls } from '../components/FilterControls';
import { UndoToast } from '../components/UndoToast';
import { RecentlyAccessedSidebar } from '../components/RecentlyAccessedSidebar';
import { SyncStatus } from '../components/SyncStatus';
import { ToastContainer } from 'react-toastify';
import './BoardPage.css';

export const BoardPage = () => {
  const {
    issues,
    loading,
    filters,
    startPolling,
    stopPolling,
    loadRecentlyAccessed,
    updateIssue,
  } = useIssueStore();

  const isAdmin = currentUser.role === 'admin';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadRecentlyAccessed();
    startPolling();

    return () => {
      stopPolling();
    };
  }, [loadRecentlyAccessed, startPolling, stopPolling]);


  const filteredAndSortedIssues = useMemo(() => {
    return filterAndSortIssues(
      issues,
      filters.searchQuery,
      filters.assigneeFilter,
      filters.severityFilter
    );
  }, [issues, filters]);


  const issuesByStatus = useMemo(() => {
    const backlog = filteredAndSortedIssues.filter(issue => issue.status === ProgressStatus.Backlog);
    const inProgress = filteredAndSortedIssues.filter(issue => issue.status === ProgressStatus.InProgress);
    const done = filteredAndSortedIssues.filter(issue => issue.status === ProgressStatus.Done);

    return { backlog, inProgress, done };
  }, [filteredAndSortedIssues]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !isAdmin) return;

    const issueId = active.id as string;
    const newStatus = over.id as IssueStatus;

    const issue = issues.find(i => i.id === issueId);
    if (!issue || issue.status === newStatus) return;

    updateIssue(issueId, { status: newStatus });
  };

  if (loading && issues.length === 0) {
    return (
      <div className="board-page">
        <div className="loading-state">Loading issues...</div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="board-page">
        <div className="board-header">
          <div className="header-top">
            <h1 className="board-title">Issue Board</h1>
            <SyncStatus />
          </div>

          <div className="board-controls">
            <SearchBar />
            <FilterControls />
          </div>

          {!isAdmin && (
            <div className="read-only-banner">
              You are viewing in read-only mode. Admin access required to make changes.
            </div>
          )}
        </div>

        <div className="board-content">
          <div className="board-columns">
            <Column status="Backlog" issues={issuesByStatus.backlog} />
            <Column status="In Progress" issues={issuesByStatus.inProgress} />
            <Column status="Done" issues={issuesByStatus.done} />
          </div>
          <RecentlyAccessedSidebar />
        </div>

        <UndoToast />

        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />

      </div>
    </DndContext>
  );
};
