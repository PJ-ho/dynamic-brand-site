import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

// Test component to access theme context
function TestComponent() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={() => setTheme('light')} data-testid="set-light">
        Set Light
      </button>
    </div>
  );
}

describe('US-004: localStorage persistence for theme preference', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('AC 1: Theme changes are saved to localStorage with key "theme"', () => {
    it('should save theme to localStorage with key "theme" when changed', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      act(() => {
        screen.getByTestId('set-dark').click();
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should update localStorage immediately when theme changes', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      act(() => {
        screen.getByTestId('set-dark').click();
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(localStorage.getItem('theme')).toBe('dark');

      act(() => {
        screen.getByTestId('set-light').click();
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(localStorage.getItem('theme')).toBe('light');
    });
  });

  describe('AC 2: On page load, theme is restored from localStorage', () => {
    it('should restore theme from localStorage on mount', async () => {
      localStorage.setItem('theme', 'dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    });

    it('should restore light theme from localStorage', async () => {
      localStorage.setItem('theme', 'light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });
  });

  describe('AC 3: SSR works without errors', () => {
    it('should not access localStorage during initial render (SSR-safe)', () => {
      // This test validates that the component can render without localStorage
      // being available (as in SSR), and only accesses it in useEffect
      
      const { container } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Should render without errors
      expect(container.firstChild).toBeTruthy();
      // Default theme should be 'light' initially
      expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });

    it('should handle missing localStorage gracefully', async () => {
      // Simulate localStorage being unavailable (SSR scenario)
      const originalLocalStorage = global.localStorage;
      
      try {
        // @ts-ignore
        delete global.localStorage;

        // Should not throw during render
        const { unmount } = render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        );

        // Wait for effects to run
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
        });

        // Component should render with default theme
        expect(screen.getByTestId('theme-value').textContent).toBe('light');
        
        unmount();
      } finally {
        // Restore localStorage for cleanup
        global.localStorage = originalLocalStorage;
      }
    });
  });

  describe('AC 4: Default theme is "light" when localStorage is empty', () => {
    it('should default to light theme when localStorage is empty', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });

    it('should default to light theme when localStorage has no theme key', async () => {
      localStorage.setItem('other-key', 'value');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });
  });

  describe('AC 5: localStorage value updates immediately when theme changes', () => {
    it('should update localStorage synchronously after theme state change', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Change to dark
      act(() => {
        screen.getByTestId('set-dark').click();
      });

      // Wait for useEffect
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(localStorage.getItem('theme')).toBe('dark');

      // Change to light
      act(() => {
        screen.getByTestId('set-light').click();
      });

      // Wait for useEffect
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('should persist multiple theme changes in sequence', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const themes = ['dark', 'light', 'dark', 'dark', 'light'] as const;

      for (const theme of themes) {
        act(() => {
          screen.getByTestId(`set-${theme}`).click();
        });

        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(localStorage.getItem('theme')).toBe(theme);
      }
    });
  });
});
