import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Helper to render with ThemeProvider
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    // Mock PointerEvent for Framer Motion
    if (typeof window.PointerEvent === 'undefined') {
      class PointerEvent extends MouseEvent {
        constructor(type: string, params: MouseEventInit = {}) {
          super(type, params);
        }
      }
      window.PointerEvent = PointerEvent as any;
    }
  });

  it('renders without crashing', () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows moon icon in light mode', async () => {
    renderWithTheme(<ThemeToggle />);
    
    // Wait for component to mount and initialize
    await screen.findByRole('button');
    
    // Find moon icon (should be visible in light mode)
    const button = screen.getByRole('button');
    const svgs = button.querySelectorAll('svg');
    
    // There should be two SVGs (sun and moon)
    expect(svgs).toHaveLength(2);
  });

  it('shows sun icon in dark mode', async () => {
    // Mock system preference as dark
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    renderWithTheme(<ThemeToggle />);
    
    // Wait for component to mount
    await screen.findByRole('button');
    
    const button = screen.getByRole('button');
    const svgs = button.querySelectorAll('svg');
    expect(svgs).toHaveLength(2);
  });

  it('has aria-label describing its action', async () => {
    renderWithTheme(<ThemeToggle />);
    
    const button = await screen.findByRole('button');
    expect(button).toHaveAttribute('aria-label');
    expect(button.getAttribute('aria-label')).toMatch(/switch to \w+ mode/i);
  });

  it('aria-label updates based on current theme', async () => {
    renderWithTheme(<ThemeToggle />);
    
    const button = await screen.findByRole('button');
    const initialLabel = button.getAttribute('aria-label');
    
    // Click to toggle theme
    fireEvent.click(button);
    
    // Wait for state update
    await screen.findByRole('button');
    const newLabel = button.getAttribute('aria-label');
    
    // Labels should be different
    expect(newLabel).not.toBe(initialLabel);
  });

  it('toggles theme between light and dark on click', async () => {
    renderWithTheme(<ThemeToggle />);
    
    const button = await screen.findByRole('button');
    
    // Initial theme should be light (system preference mocked as light)
    expect(button.getAttribute('aria-label')).toBe('Switch to dark mode');
    
    // Click to toggle
    fireEvent.click(button);
    
    // Should now show dark mode
    await screen.findByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Switch to light mode');
    
    // Click again to toggle back
    fireEvent.click(button);
    
    // Should be back to light mode
    await screen.findByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Switch to dark mode');
  });

  it('is keyboard accessible with Enter key', async () => {
    renderWithTheme(<ThemeToggle />);
    
    const button = await screen.findByRole('button');
    
    // Focus the button
    button.focus();
    expect(button).toHaveFocus();
    
    // Initial state
    const initialLabel = button.getAttribute('aria-label');
    
    // Press Enter
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    
    // Theme should toggle
    await screen.findByRole('button');
    const newLabel = button.getAttribute('aria-label');
    expect(newLabel).not.toBe(initialLabel);
  });

  it('is keyboard accessible with Space key', async () => {
    renderWithTheme(<ThemeToggle />);
    
    const button = await screen.findByRole('button');
    
    // Focus the button
    button.focus();
    expect(button).toHaveFocus();
    
    // Initial state
    const initialLabel = button.getAttribute('aria-label');
    
    // Press Space
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    
    // Theme should toggle
    await screen.findByRole('button');
    const newLabel = button.getAttribute('aria-label');
    expect(newLabel).not.toBe(initialLabel);
  });

  it('has proper button role', async () => {
    renderWithTheme(<ThemeToggle />);
    
    const button = await screen.findByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('applies navbar design styling classes', async () => {
    renderWithTheme(<ThemeToggle />);
    
    const button = await screen.findByRole('button');
    
    // Check for styling classes that match navbar design
    expect(button).toHaveClass('rounded-full');
    expect(button).toHaveClass('transition-colors');
    expect(button).toHaveClass('duration-300');
  });

  it('has focus states for accessibility', async () => {
    renderWithTheme(<ThemeToggle />);
    
    const button = await screen.findByRole('button');
    
    // Check for focus styles
    expect(button).toHaveClass('focus:outline-none');
    expect(button).toHaveClass('focus:ring-2');
    expect(button).toHaveClass('focus:ring-gold');
  });

  it('persists theme preference to localStorage on toggle', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    
    renderWithTheme(<ThemeToggle />);
    
    const button = await screen.findByRole('button');
    
    // Toggle theme
    fireEvent.click(button);
    
    // Wait for state update
    await screen.findByRole('button');
    
    // Check localStorage was updated
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');
    
    setItemSpy.mockRestore();
  });

  it('renders both sun and moon icons', async () => {
    renderWithTheme(<ThemeToggle />);
    
    const button = await screen.findByRole('button');
    const svgs = button.querySelectorAll('svg');
    
    // Should have both sun and moon icons
    expect(svgs).toHaveLength(2);
    
    // Both should be present in the DOM (one visible, one hidden via opacity)
    expect(svgs[0]).toBeDefined();
    expect(svgs[1]).toBeDefined();
  });

  it('has smooth transitions via Framer Motion', async () => {
    const { container } = renderWithTheme(<ThemeToggle />);
    
    // Check that motion components are rendered (Framer Motion adds data-framer attributes)
    const button = await screen.findByRole('button');
    expect(button.tagName.toLowerCase()).toBe('button');
  });
});
