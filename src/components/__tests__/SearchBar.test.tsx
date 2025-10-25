import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../SearchBar';
import { useIssueStore } from '../../store/issueStore';

jest.mock('../../store/issueStore');

const mockSetSearchQuery = jest.fn();

describe('SearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    (useIssueStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = { setSearchQuery: mockSetSearchQuery };
      return selector ? selector(state) : state;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render search input', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Search by title or tags...')).toBeInTheDocument();
  });

  it('should debounce search query by 300ms', async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search by title or tags...');

    fireEvent.change(input, { target: { value: 'test' } });

    expect(mockSetSearchQuery).not.toHaveBeenCalled();

    jest.advanceTimersByTime(299);
    expect(mockSetSearchQuery).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(mockSetSearchQuery).toHaveBeenCalledWith('test');
  });

  it('should cancel previous debounce when typing quickly', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search by title or tags...');

    fireEvent.change(input, { target: { value: 't' } });
    jest.advanceTimersByTime(100);

    fireEvent.change(input, { target: { value: 'te' } });
    jest.advanceTimersByTime(100);

    fireEvent.change(input, { target: { value: 'tes' } });
    jest.advanceTimersByTime(100);

    fireEvent.change(input, { target: { value: 'test' } });
    jest.advanceTimersByTime(300);

    expect(mockSetSearchQuery).toHaveBeenCalledTimes(1);
    expect(mockSetSearchQuery).toHaveBeenCalledWith('test');
  });

  it('should show clear button when input has value', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search by title or tags...');

    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'test' } });

    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('should clear input when clear button is clicked', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search by title or tags...') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');

    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);

    expect(input.value).toBe('');
  });

  it('should update store when cleared', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search by title or tags...');

    fireEvent.change(input, { target: { value: 'test' } });
    jest.advanceTimersByTime(300);

    mockSetSearchQuery.mockClear();

    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);
    jest.advanceTimersByTime(300);

    expect(mockSetSearchQuery).toHaveBeenCalledWith('');
  });
});
