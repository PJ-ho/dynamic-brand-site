import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
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

describe('US-005: System theme preference detection with media query', () => {
  let matchMediaMock: jest.Mock;
  let mediaQueryListeners: { [key: string]: (e: MediaQueryListEvent) => void };

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    mediaQueryListeners = {};

    // Create a mock matchMedia function
    matchMediaMock = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
        mediaQueryListeners[event] = handler;
      }),
      removeEventListener: jest.fn((event: string) => {
        delete mediaQueryListeners[event];
      }),
      dispatchEvent: jest.fn(),
    }));

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('AC 1: ThemeProvider checks prefers-color-scheme media query on mount', () => {
    it('should call matchMedia with prefers-color-scheme: dark', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('should check media query during initialization', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should have been called at least once for system preference check
      expect(matchMediaMock).toHaveBeenCalled();
    });
  });

  describe('AC 2: If no localStorage theme, system preference is used', () => {
    it('should use dark theme when system prefers dark and no localStorage theme', async () => {
      // Set up matchMedia to return dark preference
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
          mediaQueryListeners[event] = handler;
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

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

    it('should use light theme when system prefers light and no localStorage theme', async () => {
      // Set up matchMedia to return light preference (default behavior)
      matchMediaMock.mockImplementation((query: string) => ({
        matches: false, // Not dark = light
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
          mediaQueryListeners[event] = handler;
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

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

    it('should prioritize localStorage theme over system preference', async () => {
      // Set localStorage to light
      localStorage.setItem('theme', 'light');

      // Set system preference to dark
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
          mediaQueryListeners[event] = handler;
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should use localStorage theme, not system preference
      expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });
  });

  describe('AC 3: Event listener added for system preference changes', () => {
    it('should add event listener for change event on media query', async () => {
      const addEventListenerMock = jest.fn();

      matchMediaMock.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: addEventListenerMock,
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Check that addEventListener was called with 'change' event
      expect(addEventListenerMock).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('should add event listener during mount', async () => {
      const addEventListenerMock = jest.fn();

      matchMediaMock.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: addEventListenerMock,
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // addEventListener should have been called
      expect(addEventListenerMock).toHaveBeenCalled();

      unmount();
    });

    it('should clean up event listener on unmount', async () => {
      const addEventListenerMock = jest.fn();
      const removeEventListenerMock = jest.fn();

      matchMediaMock.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
        dispatchEvent: jest.fn(),
      }));

      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      unmount();

      // removeEventListener should have been called during cleanup
      expect(removeEventListenerMock).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });
  });

  describe('AC 4: System preference changes update theme (when no manual preference set)', () => {
    it('should update theme when system preference changes to dark', async () => {
      let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;

      matchMediaMock.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
          if (event === 'change') {
            changeHandler = handler;
          }
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Initial theme should be light
      expect(screen.getByTestId('theme-value').textContent).toBe('light');

      // Simulate system preference change to dark
      await act(async () => {
        if (changeHandler) {
          changeHandler({ matches: true } as MediaQueryListEvent);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Theme should update to dark
      expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    });

    it('should update theme when system preference changes to light', async () => {
      let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;

      matchMediaMock.mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
          if (event === 'change') {
            changeHandler = handler;
          }
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Initial theme should be dark (system preference)
      expect(screen.getByTestId('theme-value').textContent).toBe('dark');

      // Simulate system preference change to light
      await act(async () => {
        if (changeHandler) {
          changeHandler({ matches: false } as MediaQueryListEvent);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Theme should update to light
      expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });

    it('should NOT update theme from system change if user has manual preference', async () => {
      let currentMatches = false;

      matchMediaMock.mockImplementation((query: string) => ({
        matches: currentMatches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
          mediaQueryListeners[event] = handler;
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Manually set theme to light
      act(() => {
        screen.getByTestId('set-light').click();
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(screen.getByTestId('theme-value').textContent).toBe('light');
      expect(localStorage.getItem('theme')).toBe('light');

      // Simulate system preference change to dark
      await act(async () => {
        const handler = mediaQueryListeners['change'];
        if (handler) {
          handler({ matches: true } as MediaQueryListEvent);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Theme should NOT change because user has manual preference
      expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });
  });

  describe('AC 5: Manual theme selection overrides system preference', () => {
    it('should override system dark preference when user selects light', async () => {
      // System prefers dark
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
          mediaQueryListeners[event] = handler;
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Initial theme is dark from system
      expect(screen.getByTestId('theme-value').textContent).toBe('dark');

      // User manually selects light
      act(() => {
        screen.getByTestId('set-light').click();
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Theme should now be light (user preference overrides system)
      expect(screen.getByTestId('theme-value').textContent).toBe('light');
      expect(localStorage.getItem('theme')).toBe('light');

      // Simulate system preference staying dark
      await act(async () => {
        const handler = mediaQueryListeners['change'];
        if (handler) {
          handler({ matches: true } as MediaQueryListEvent);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Theme should still be light (manual preference takes precedence)
      expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });

    it('should override system light preference when user selects dark', async () => {
      // System prefers light
      matchMediaMock.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
          mediaQueryListeners[event] = handler;
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Initial theme is light from system
      expect(screen.getByTestId('theme-value').textContent).toBe('light');

      // User manually selects dark
      act(() => {
        screen.getByTestId('set-dark').click();
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Theme should now be dark (user preference overrides system)
      expect(screen.getByTestId('theme-value').textContent).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should maintain manual preference across system changes', async () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
          mediaQueryListeners[event] = handler;
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // User manually sets dark
      act(() => {
        screen.getByTestId('set-dark').click();
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(screen.getByTestId('theme-value').textContent).toBe('dark');

      // System changes multiple times
      for (let i = 0; i < 3; i++) {
        await act(async () => {
          const handler = mediaQueryListeners['change'];
          if (handler) {
            handler({ matches: i % 2 === 0 } as MediaQueryListEvent);
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        });

        // Theme should remain dark (manual preference)
        expect(screen.getByTestId('theme-value').textContent).toBe('dark');
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle missing matchMedia gracefully', async () => {
      // Remove matchMedia
      const originalMatchMedia = window.matchMedia;
      // @ts-ignore
      delete window.matchMedia;

      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should default to light theme
      expect(screen.getByTestId('theme-value').textContent).toBe('light');

      unmount();

      // Restore matchMedia
      window.matchMedia = originalMatchMedia;
    });

    it('should handle SSR scenario where window is undefined', async () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      // Should not throw
      expect(() => {
        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        );
      }).not.toThrow();

      // Restore window
      global.window = originalWindow;
    });

    it('should detect system preference on mount even if initially dark', async () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: true, // System prefers dark
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
          mediaQueryListeners[event] = handler;
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Theme should be dark from system preference
      expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    });
  });
});
