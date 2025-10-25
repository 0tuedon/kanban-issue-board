import { renderHook, act } from '@testing-library/react';
import { useIssueStore } from '../issueStore';

describe('Filter Operations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should have initial filter state', () => {
    const { result } = renderHook(() => useIssueStore());

    expect(result.current.filters).toEqual({
      searchQuery: '',
      assigneeFilter: '',
      severityFilter: null,
    });
  });

  it('should update search query', () => {
    const { result } = renderHook(() => useIssueStore());

    act(() => {
      result.current.setSearchQuery('bug fix');
    });

    expect(result.current.filters.searchQuery).toBe('bug fix');
  });

  it('should update assignee filter', () => {
    const { result } = renderHook(() => useIssueStore());

    act(() => {
      result.current.setAssigneeFilter('Alice');
    });

    expect(result.current.filters.assigneeFilter).toBe('Alice');
  });

  it('should update severity filter', () => {
    const { result } = renderHook(() => useIssueStore());

    act(() => {
      result.current.setSeverityFilter(3);
    });

    expect(result.current.filters.severityFilter).toBe(3);
  });

  it('should reset severity filter to null', () => {
    const { result } = renderHook(() => useIssueStore());

    act(() => {
      result.current.setSeverityFilter(2);
    });

    expect(result.current.filters.severityFilter).toBe(2);

    act(() => {
      result.current.setSeverityFilter(null);
    });

    expect(result.current.filters.severityFilter).toBe(null);
  });

  it('should update multiple filters independently', () => {
    const { result } = renderHook(() => useIssueStore());

    act(() => {
      result.current.setSearchQuery('urgent');
      result.current.setAssigneeFilter('Bob');
      result.current.setSeverityFilter(1);
    });

    expect(result.current.filters).toEqual({
      searchQuery: 'urgent',
      assigneeFilter: 'Bob',
      severityFilter: 1,
    });
  });

  it('should preserve other filters when updating one', () => {
    const { result } = renderHook(() => useIssueStore());

    act(() => {
      result.current.setSearchQuery('test');
      result.current.setAssigneeFilter('Alice');
    });

    act(() => {
      result.current.setSeverityFilter(2);
    });

    expect(result.current.filters.searchQuery).toBe('test');
    expect(result.current.filters.assigneeFilter).toBe('Alice');
    expect(result.current.filters.severityFilter).toBe(2);
  });
});

describe('Recently Accessed', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should start with empty recently accessed list', () => {
    const { result } = renderHook(() => useIssueStore());
    expect(result.current.recentlyAccessedIds).toEqual([]);
  });

  it('should add issue to recently accessed', () => {
    const { result } = renderHook(() => useIssueStore());

    act(() => {
      result.current.addRecentlyAccessed('issue-1');
    });

    expect(result.current.recentlyAccessedIds).toEqual(['issue-1']);
  });

  it('should add multiple issues in order', () => {
    const { result } = renderHook(() => useIssueStore());

    act(() => {
      result.current.addRecentlyAccessed('issue-1');
      result.current.addRecentlyAccessed('issue-2');
      result.current.addRecentlyAccessed('issue-3');
    });

    expect(result.current.recentlyAccessedIds).toEqual(['issue-3', 'issue-2', 'issue-1']);
  });

  it('should move existing issue to top when accessed again', () => {
    const { result } = renderHook(() => useIssueStore());

    act(() => {
      result.current.addRecentlyAccessed('issue-1');
      result.current.addRecentlyAccessed('issue-2');
      result.current.addRecentlyAccessed('issue-3');
    });

    act(() => {
      result.current.addRecentlyAccessed('issue-1');
    });

    expect(result.current.recentlyAccessedIds).toEqual(['issue-1', 'issue-3', 'issue-2']);
  });

  it('should maintain max 5 recent issues', () => {
    const { result } = renderHook(() => useIssueStore());

    act(() => {
      result.current.addRecentlyAccessed('issue-1');
      result.current.addRecentlyAccessed('issue-2');
      result.current.addRecentlyAccessed('issue-3');
      result.current.addRecentlyAccessed('issue-4');
      result.current.addRecentlyAccessed('issue-5');
      result.current.addRecentlyAccessed('issue-6');
    });

    expect(result.current.recentlyAccessedIds).toHaveLength(5);
    expect(result.current.recentlyAccessedIds).toEqual([
      'issue-6',
      'issue-5',
      'issue-4',
      'issue-3',
      'issue-2',
    ]);
    expect(result.current.recentlyAccessedIds).not.toContain('issue-1');
  });
});
