import { render, screen } from '@testing-library/react';
import { Navigation } from '../Navigation';


jest.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
}), { virtual: true });

describe('Navigation', () => {
  it('should render navigation element', () => {
    render(<Navigation />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('should have aria-label for accessibility', () => {
    render(<Navigation />);
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
  });

  it('should render Board link', () => {
    render(<Navigation />);
    const boardLink = screen.getByText('Board');
    expect(boardLink).toBeInTheDocument();
    expect(boardLink).toHaveAttribute('href', '/board');
  });

  it('should render Settings link', () => {
    render(<Navigation />);
    const settingsLink = screen.getByText('Settings');
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });

  it('should have nav-link class on links', () => {
    render(<Navigation />);
    const boardLink = screen.getByText('Board');
    const settingsLink = screen.getByText('Settings');

    expect(boardLink).toHaveClass('nav-link');
    expect(settingsLink).toHaveClass('nav-link');
  });
});
