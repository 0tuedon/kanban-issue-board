import { calculatePriorityScore, sortIssuesByPriority, filterAndSortIssues } from '../sorting';
import { Issue } from '../../types';

const createMockIssue = (overrides: Partial<Issue>): Issue => ({
  id: '1',
  title: 'Test Issue',
  status: 'Backlog',
  priority: 'medium',
  severity: 2,
  createdAt: new Date().toISOString(),
  assignee: 'Alice',
  tags: ['bug'],
  ...overrides,
});

describe('calculatePriorityScore', () => {
  it('should calculate higher score for higher severity', () => {
    const lowSeverity = createMockIssue({ severity: 1 });
    const highSeverity = createMockIssue({ severity: 3 });

    expect(calculatePriorityScore(highSeverity)).toBeGreaterThan(calculatePriorityScore(lowSeverity));
  });

  it('should calculate lower score for older issues', () => {
    const recent = createMockIssue({ createdAt: new Date().toISOString() });
    const old = createMockIssue({
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    });

    expect(calculatePriorityScore(recent)).toBeGreaterThan(calculatePriorityScore(old));
  });

});

describe('sortIssuesByPriority', () => {
  it('should sort issues by priority score descending', () => {
    const issues: Issue[] = [
      createMockIssue({ id: '1', severity: 1 }),
      createMockIssue({ id: '2', severity: 3 }),
      createMockIssue({ id: '3', severity: 2 }),
    ];

    const sorted = sortIssuesByPriority(issues);

    expect(sorted[0].id).toBe('2');
    expect(sorted[2].id).toBe('1');
  });

  it('should not mutate original array', () => {
    const issues: Issue[] = [
      createMockIssue({ id: '1', severity: 1 }),
      createMockIssue({ id: '2', severity: 3 }),
    ];

    const sorted = sortIssuesByPriority(issues);

    expect(sorted).not.toBe(issues);
    expect(issues[0].id).toBe('1');
  });

  it('should handle empty array', () => {
    expect(sortIssuesByPriority([])).toEqual([]);
  });

  it('should handle single issue', () => {
    const issue = createMockIssue({ id: '1' });
    const sorted = sortIssuesByPriority([issue]);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].id).toBe('1');
  });
});

describe('filterAndSortIssues', () => {
  const mockIssues: Issue[] = [
    createMockIssue({ id: '1', title: 'Fix login bug', severity: 3, assignee: 'Alice', tags: ['bug', 'auth'] }),
    createMockIssue({ id: '2', title: 'Add dark mode', severity: 1, assignee: 'Bob', tags: ['feature'] }),
    createMockIssue({ id: '3', title: 'Update documentation', severity: 2, assignee: 'Alice', tags: ['docs'] }),
  ];

  describe('search query filtering', () => {
    it('should filter by title (case insensitive)', () => {
      const result = filterAndSortIssues(mockIssues, 'login', '', null);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should filter by tags', () => {
      const result = filterAndSortIssues(mockIssues, 'auth', '', null);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should return all issues when search is empty', () => {
      const result = filterAndSortIssues(mockIssues, '', '', null);
      expect(result).toHaveLength(3);
    });

    it('should handle no matches', () => {
      const result = filterAndSortIssues(mockIssues, 'nonexistent', '', null);
      expect(result).toHaveLength(0);
    });
  });

  describe('assignee filtering', () => {
    it('should filter by assignee', () => {
      const result = filterAndSortIssues(mockIssues, '', 'Alice', null);
      expect(result).toHaveLength(2);
      expect(result.every(issue => issue.assignee === 'Alice')).toBe(true);
    });

    it('should return all issues when assignee filter is empty', () => {
      const result = filterAndSortIssues(mockIssues, '', '', null);
      expect(result).toHaveLength(3);
    });
  });

  describe('severity filtering', () => {
    it('should filter by severity level', () => {
      const result = filterAndSortIssues(mockIssues, '', '', 3);
      expect(result).toHaveLength(1);
      expect(result[0].severity).toBe(3);
    });

    it('should return all issues when severity is null', () => {
      const result = filterAndSortIssues(mockIssues, '', '', null);
      expect(result).toHaveLength(3);
    });
  });

  describe('combined filtering', () => {
    it('should apply all filters together', () => {
      const result = filterAndSortIssues(mockIssues, 'bug', 'Alice', 3);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should return empty array when no matches', () => {
      const result = filterAndSortIssues(mockIssues, 'bug', 'Bob', null);
      expect(result).toHaveLength(0);
    });
  });

  describe('sorting after filtering', () => {
    it('should sort filtered results by priority', () => {
      const result = filterAndSortIssues(mockIssues, '', 'Alice', null);
      expect(result[0].severity).toBeGreaterThanOrEqual(result[1].severity);
    });
  });
});
