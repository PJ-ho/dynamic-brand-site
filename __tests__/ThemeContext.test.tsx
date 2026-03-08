import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme, Theme } from '@/contexts/ThemeContext';

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

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset document attribute
    document.documentElement.removeAttribute('data-theme');
  });

  it('should provide default theme as light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeValue = screen.getByTestId('theme-value');
    expect(themeValue.textContent).toBe('light');
  });

  it('should allow theme to be changed', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeValue = screen.getByTestId('theme-value');
    const setDarkButton = screen.getByTestId('set-dark');

    expect(themeValue.textContent).toBe('light');

    act(() => {
      setDarkButton.click();
    });

    expect(themeValue.textContent).toBe('dark');
  });

  it('should persist theme to localStorage', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const setDarkButton = screen.getByTestId('set-dark');

    act(() => {
      setDarkButton.click();
    });

    // Wait for useEffect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should load theme from localStorage', async () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Wait for useEffect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const themeValue = screen.getByTestId('theme-value');
    expect(themeValue.textContent).toBe('dark');
  });

  it('should update document data-theme attribute', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const setDarkButton = screen.getByTestId('set-dark');

    act(() => {
      setDarkButton.click();
    });

    // Wait for useEffect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('should throw error when useTheme is used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    console.error = consoleError;
  });

  it('should export Theme type', () => {
    // This is a compile-time check, but we can verify the type exists
    const theme: Theme = 'light';
    expect(theme).toBe('light');
  });

  it('should provide setTheme function', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const setLightButton = screen.getByTestId('set-light');
    const setDarkButton = screen.getByTestId('set-dark');
    const themeValue = screen.getByTestId('theme-value');

    expect(themeValue.textContent).toBe('light');

    act(() => {
      setDarkButton.click();
    });
    expect(themeValue.textContent).toBe('dark');

    act(() => {
      setLightButton.click();
    });
    expect(themeValue.textContent).toBe('light');
  });
});
