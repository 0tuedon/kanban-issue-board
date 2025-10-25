import { render, screen, fireEvent, within } from '@testing-library/react';
import { FilterControls } from '../FilterControls';
import { useIssueStore } from '../../store/issueStore';
import { Issue } from '../../types';

jest.mock('../../store/issueStore');

const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Issue 1',
    status: 'Backlog',
    priority: 'high',
    severity: 3,
    createdAt: new Date().toISOString(),
    assignee: 'Alice',
    tags: ['bug'],
  },
  {
    id: '2',
    title: 'Issue 2',
    status: 'In Progress',
    priority: 'medium',
    severity: 2,
    createdAt: new Date().toISOString(),
    assignee: 'Bob',
    tags: ['feature'],
  },
  {
    id: '3',
    title: 'Issue 3',
    status: 'Done',
    priority: 'low',
    severity: 1,
    createdAt: new Date().toISOString(),
    assignee: 'Alice',
    tags: ['docs'],
  },
];

const mockSetAssigneeFilter = jest.fn();
const mockSetSeverityFilter = jest.fn();

describe('FilterControls', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useIssueStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        issues: mockIssues,
        filters: {
          searchQuery: '',
          assigneeFilter: '',
          severityFilter: null,
        },
        setAssigneeFilter: mockSetAssigneeFilter,
        setSeverityFilter: mockSetSeverityFilter,
      };

      return selector ? selector(state) : state;
    });
  });

  describe('rendering', () => {
    it('should render assignee filter', () => {
      render(<FilterControls />);

      expect(screen.getByLabelText('Assignee:')).toBeInTheDocument();
    });

    it('should render severity filter', () => {
      render(<FilterControls />);

      expect(screen.getByLabelText('Severity:')).toBeInTheDocument();
    });

    it('should show unique assignees in dropdown', () => {
      render(<FilterControls />);

      const assigneeSelect = screen.getByLabelText('Assignee:');
      const options = within(assigneeSelect).getAllByRole('option');

      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('All');
      expect(options[1]).toHaveTextContent('Alice');
      expect(options[2]).toHaveTextContent('Bob');
    });

    it('should show severity levels 1-3', () => {
      render(<FilterControls />);

      const severitySelect = screen.getByLabelText('Severity:');
      const options = within(severitySelect).getAllByRole('option');

      expect(options).toHaveLength(4);
      expect(options[0]).toHaveTextContent('All');
      expect(options[1]).toHaveTextContent('Level 1');
      expect(options[2]).toHaveTextContent('Level 2');
      expect(options[3]).toHaveTextContent('Level 3');
    });
  });

  describe('assignee filter interactions', () => {
    it('should call setAssigneeFilter on change', () => {
      render(<FilterControls />);

      const assigneeSelect = screen.getByLabelText('Assignee:');
      fireEvent.change(assigneeSelect, { target: { value: 'Alice' } });

      expect(mockSetAssigneeFilter).toHaveBeenCalledWith('Alice');
    });

    it('should handle "All" selection', () => {
      render(<FilterControls />);

      const assigneeSelect = screen.getByLabelText('Assignee:');
      fireEvent.change(assigneeSelect, { target: { value: '' } });

      expect(mockSetAssigneeFilter).toHaveBeenCalledWith('');
    });
  });

  describe('severity filter interactions', () => {
    it('should call setSeverityFilter with number on change', () => {
      render(<FilterControls />);

      const severitySelect = screen.getByLabelText('Severity:');
      fireEvent.change(severitySelect, { target: { value: '3' } });

      expect(mockSetSeverityFilter).toHaveBeenCalledWith(3);
    });

    it('should handle "All" selection with null', () => {
      render(<FilterControls />);

      const severitySelect = screen.getByLabelText('Severity:');
      fireEvent.change(severitySelect, { target: { value: '' } });

      expect(mockSetSeverityFilter).toHaveBeenCalledWith(null);
    });
  });

  describe('memoization', () => {
    it('should sort assignees alphabetically', () => {
      render(<FilterControls />);

      const assigneeSelect = screen.getByLabelText('Assignee:');
      const options = within(assigneeSelect).getAllByRole('option').slice(1);

      expect(options[0]).toHaveTextContent('Alice');
      expect(options[1]).toHaveTextContent('Bob');
    });
  });
});
