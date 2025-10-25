import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Issue, UndoState, FilterState } from '../types';
import { mockFetchIssues, mockUpdateIssue } from '../utils/api';
import { toast } from 'react-toastify';
import initialIssuesData from '../data/issues.json';

interface IssueStore {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  undoState: UndoState | null;
  recentlyAccessedIds: string[];
  lastSyncTime: number | null;
  pollingInterval: number;

// Methods for the issueStore interface
  fetchIssues: () => Promise<void>;
  updateIssue: (issueId: string, updates: Partial<Issue>) => Promise<void>;
  undoUpdate: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setAssigneeFilter: (assignee: string) => void;
  setSeverityFilter: (severity: number | null) => void;
  addRecentlyAccessed: (issueId: string) => void;
  loadRecentlyAccessed: () => void;
  startPolling: () => void;
  stopPolling: () => void;
  setPollingInterval: (interval: number) => void;
}


let pollingTimer: NodeJS.Timeout | null = null;

export const useIssueStore = create<IssueStore>()(
  persist(
    (set, get) => ({
      issues: initialIssuesData as Issue[],
      loading: false,
      error: null,
      filters: {
        searchQuery: '',
        assigneeFilter: '',
        severityFilter: null,
      },
      undoState: null,
      recentlyAccessedIds: [],
      lastSyncTime: null,
      pollingInterval: 10000,

  // Try to fetch issues from our mock api
  fetchIssues: async () => {
    try {
      set({ loading: true, error: null });
      const data = await mockFetchIssues() as Issue[];
      set({ issues: data, loading: false, lastSyncTime: Date.now() });
    } catch (err) {
      set({ error: 'Failed to fetch issues', loading: false });
      toast.error('Failed to fetch issues');
    }
  },


  updateIssue: async (issueId: string, updates: Partial<Issue>) => {
    const { issues } = get();
    const issueToUpdate = issues.find(issue => issue.id === issueId);

    if (!issueToUpdate) {
      toast.error('Issue not found');
      return;
    }

    const undoState: UndoState = {
      previousIssue: { ...issueToUpdate },
      timestamp: Date.now(),
    };

    const updatedIssues = issues.map(issue =>
      issue.id === issueId ? { ...issue, ...updates } : issue
    );
    set({ issues: updatedIssues, undoState });

    setTimeout(() => {
      const currentUndoState = get().undoState;
      if (currentUndoState && currentUndoState.timestamp === undoState.timestamp) {
        set({ undoState: null });
      }
    }, 5000);

    try {
      await mockUpdateIssue(issueId, updates);

    } catch (err) {
      set({ issues, undoState: null });
      toast.error('Failed to update issue. Changes have been reverted.');
    }
  },

  
  undoUpdate: async () => {
    const { undoState, issues } = get();

    if (!undoState) {
      toast.error('Nothing to undo');
      return;
    }

    const { previousIssue } = undoState;

    const revertedIssues = issues.map(issue =>
      issue.id === previousIssue.id ? previousIssue : issue
    );

    set({ issues: revertedIssues, undoState: null });

    try {
      await mockUpdateIssue(previousIssue.id, previousIssue);
      toast.success('Changes undone successfully');
    } catch (err) {
      toast.error('Failed to undo changes');
    }
  },

  setSearchQuery: (query: string) => {
    set(state => ({
      filters: { ...state.filters, searchQuery: query }
    }));
  },

  setAssigneeFilter: (assignee: string) => {
    set(state => ({
      filters: { ...state.filters, assigneeFilter: assignee }
    }));
  },

  setSeverityFilter: (severity: number | null) => {
    set(state => ({
      filters: { ...state.filters, severityFilter: severity }
    }));
  },

  addRecentlyAccessed: (issueId: string) => {
    const { recentlyAccessedIds } = get();

    const filtered = recentlyAccessedIds.filter(id => id !== issueId);

    const updated = [issueId, ...filtered].slice(0, 5);

    set({ recentlyAccessedIds: updated });
  },

  loadRecentlyAccessed: () => {
    
  },

  startPolling: () => {
    const { pollingInterval, fetchIssues } = get();

    if (pollingTimer) {
      clearInterval(pollingTimer);
    }

    fetchIssues();

    pollingTimer = setInterval(() => {
      fetchIssues();
    }, pollingInterval);
  },


  stopPolling: () => {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
  },

  setPollingInterval: (interval: number) => {
    set({ pollingInterval: interval });

    if (pollingTimer) {
      get().stopPolling();
      get().startPolling();
    }
  },
    }),
    {
      name: 'issue-board-storage',
      partialize: (state) => ({
        filters: state.filters,
        recentlyAccessedIds: state.recentlyAccessedIds,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);
