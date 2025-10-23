import dayjs from 'dayjs';
import { Issue } from '../types';

/**
 * @param issue - The issue to calculate score for
 * @returns The priority score
 */
export const calculatePriorityScore = (issue: Issue): number => {
  const daysSinceCreated = dayjs().diff(dayjs(issue.createdAt), 'day');
  const userDefinedRank = issue.userDefinedRank ?? 0;

  return issue.severity * 10 + (daysSinceCreated * -1) + userDefinedRank;
};

/**
 * @param issues - Array of issues to sort
 * @returns Sorted array of issues
 */
export const sortIssuesByPriority = (issues: Issue[]): Issue[] => {
  return [...issues].sort((a, b) => {
    const scoreA = calculatePriorityScore(a);
    const scoreB = calculatePriorityScore(b);

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }
    return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
  });
};

/**
 * @param issues - issue Array
 * @param searchQuery - query for searching
 * @param assigneeFilter - filter by asignee
 * @param severityFilter -  severity filter
 * @returns issues
 */
export const filterAndSortIssues = (
  issues: Issue[],
  searchQuery: string,
  assigneeFilter: string,
  severityFilter: number | null
): Issue[] => {
  let filtered = issues;

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      issue =>
        issue.title.toLowerCase().includes(query) ||
        issue.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  if (assigneeFilter) {
    filtered = filtered.filter(issue => issue.assignee === assigneeFilter);
  }

  if (severityFilter !== null) {
    filtered = filtered.filter(issue => issue.severity === severityFilter);
  }

  return sortIssuesByPriority(filtered);
};
