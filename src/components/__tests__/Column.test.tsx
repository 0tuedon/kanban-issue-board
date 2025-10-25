import { render, screen } from '@testing-library/react';
import { Column } from '../Column';
import { Issue } from '../../types';

jest.mock('../IssueCard', () => ({
  IssueCard: ({ issue }: any) => <div data-testid={`issue-${issue.id}`}>{issue.title}</div>,
}));


const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Test Issue 1',
    status: 'Backlog',
    priority: 'high',
    severity: 3,
    createdAt: new Date().toISOString(),
    assignee: 'Alice',
    tags: ['bug'],
  },
  {
    id: '2',
    title: 'Test Issue 2',
    status: 'Backlog',
    priority: 'medium',
    severity: 2,
    createdAt: new Date().toISOString(),
    assignee: 'Bob',
    tags: ['feature'],
  },
];

describe('Column', () => {
  it('should render column title', () => {
    render(<Column status="Backlog" issues={[]} />);
    expect(screen.getByText('Backlog')).toBeInTheDocument();
  });

  it('should render issue count', () => {
    render(<Column status="Backlog" issues={mockIssues} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render all issues', () => {
    render(<Column status="Backlog" issues={mockIssues} />);
    expect(screen.getByText('Test Issue 1')).toBeInTheDocument();
    expect(screen.getByText('Test Issue 2')).toBeInTheDocument();
  });

  it('should show empty state when no issues', () => {
    render(<Column status="Backlog" issues={[]} />);
    expect(screen.getByText('No issues')).toBeInTheDocument();
  });

  it('should have correct aria-label for issue count', () => {
    render(<Column status="In Progress" issues={mockIssues} />);
    expect(screen.getByLabelText('2 issues')).toBeInTheDocument();
  });

  it('should render with different statuses', () => {
    const { rerender } = render(<Column status="Backlog" issues={[]} />);
    expect(screen.getByText('Backlog')).toBeInTheDocument();

    rerender(<Column status="In Progress" issues={[]} />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();

    rerender(<Column status="Done" issues={[]} />);
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('should update issue count when issues change', () => {
    const { rerender } = render(<Column status="Backlog" issues={[]} />);
    expect(screen.getByText('0')).toBeInTheDocument();

    rerender(<Column status="Backlog" issues={[mockIssues[0]]} />);
    expect(screen.getByText('1')).toBeInTheDocument();

    rerender(<Column status="Backlog" issues={mockIssues} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
