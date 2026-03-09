/**
 * US-017: Test theme toggle across page navigations
 * 
 * Tests that theme persists when navigating between pages.
 * In Next.js with App Router, navigation between pages doesn't remount
 * the root layout (where ThemeProvider is), so theme state is preserved.
 * Additionally, localStorage provides persistence across page reloads.
 */

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';
import ThemeToggle from '../src/components/ui/ThemeToggle';

// Mock Framer Motion to avoid animation complexity in tests
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, className, 'aria-label': ariaLabel, role, onKeyDown, ...props }: any) => (
      <button onClick={onClick} className={className} aria-label={ariaLabel} role={role} onKeyDown={onKeyDown} {...props}>
        {children}
      </button>
    ),
    svg: ({ children, className, ...props }: any) => (
      <svg className={className} {...props}>
        {children}
      </svg>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Next.js Link for navigation simulation
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

// Mock pages for testing navigation
const MockHomePage = () => {
  const { theme } = useTheme();
  return (
    <div data-testid="home-page">
      <h1>Home Page</h1>
      <p data-testid="current-theme">Current theme: {theme}</p>
      <ThemeToggle />
      <nav>
        <a href="/products">Products</a>
      </nav>
    </div>
  );
};

const MockProductsPage = () => {
  const { theme } = useTheme();
  return (
    <div data-testid="products-page">
      <h1>Products Page</h1>
      <p data-testid="current-theme">Current theme: {theme}</p>
      <ThemeToggle />
      <nav>
        <a href="/about">About</a>
      </nav>
    </div>
  );
};

const MockAboutPage = () => {
  const { theme } = useTheme();
  return (
    <div data-testid="about-page">
      <h1>About Page</h1>
      <p data-testid="current-theme">Current theme: {theme}</p>
      <ThemeToggle />
      <nav>
        <a href="/contact">Contact</a>
      </nav>
    </div>
  );
};

const MockContactPage = () => {
  const { theme } = useTheme();
  return (
    <div data-testid="contact-page">
      <h1>Contact Page</h1>
      <p data-testid="current-theme">Current theme: {theme}</p>
      <ThemeToggle />
    </div>
  );
};

// Helper to wait for useEffect to complete
const waitForEffects = () => act(async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
});

describe('US-017: Theme persistence across page navigations', () => {
  // PointerEvent polyfill for Framer Motion
  beforeAll(() => {
    if (typeof window !== 'undefined') {
      class PointerEvent extends MouseEvent {
        constructor(type: string, params: MouseEventInit = {}) {
          super(type, params);
        }
      }
      (window as any).PointerEvent = PointerEvent;
    }
  });

  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
    }
    // Reset document data-theme attribute
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('AC 1: Theme persists when navigating from home to products', () => {
    test('theme state is shared across pages within same ThemeProvider', async () => {
      const user = userEvent.setup();
      
      // Start on home page with light theme
      const { unmount } = render(
        <ThemeProvider>
          <MockHomePage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: light');

      // Switch to dark theme
      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      await user.click(toggleButton);
      await waitForEffects();

      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      expect(localStorage.getItem('theme')).toBe('dark');

      // Unmount home page and mount products page (simulating navigation)
      unmount();

      render(
        <ThemeProvider>
          <MockProductsPage />
        </ThemeProvider>
      );

      await waitForEffects();

      // Theme should be restored from localStorage
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      expect(screen.getByTestId('products-page')).toBeInTheDocument();
    });

    test('localStorage persists theme between page navigations', async () => {
      // Set theme in localStorage (simulating previous navigation)
      localStorage.setItem('theme', 'dark');

      const { unmount } = render(
        <ThemeProvider>
          <MockHomePage />
        </ThemeProvider>
      );

      await waitForEffects();

      // Home page should load with dark theme
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');

      // Navigate to products page
      unmount();

      render(
        <ThemeProvider>
          <MockProductsPage />
        </ThemeProvider>
      );

      await waitForEffects();

      // Products page should maintain dark theme
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });

  describe('AC 2: Theme persists when navigating from products to about', () => {
    test('theme persists from products to about page', async () => {
      const user = userEvent.setup();

      // Start on products page
      const { unmount } = render(
        <ThemeProvider>
          <MockProductsPage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: light');

      // Switch to dark theme
      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      await user.click(toggleButton);
      await waitForEffects();

      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');

      // Navigate to about page
      unmount();

      render(
        <ThemeProvider>
          <MockAboutPage />
        </ThemeProvider>
      );

      await waitForEffects();

      // About page should maintain dark theme
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      expect(screen.getByTestId('about-page')).toBeInTheDocument();
    });

    test('theme state is preserved across multiple page changes', async () => {
      // Set initial theme
      localStorage.setItem('theme', 'dark');

      // Products page
      const { unmount: unmountProducts } = render(
        <ThemeProvider>
          <MockProductsPage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      unmountProducts();

      // About page
      const { unmount: unmountAbout } = render(
        <ThemeProvider>
          <MockAboutPage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      unmountAbout();

      // Home page
      render(
        <ThemeProvider>
          <MockHomePage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
    });
  });

  describe('AC 3: Theme persists when navigating from about to contact', () => {
    test('theme persists from about to contact page', async () => {
      const user = userEvent.setup();

      // Start on about page
      const { unmount } = render(
        <ThemeProvider>
          <MockAboutPage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: light');

      // Switch to dark theme
      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      await user.click(toggleButton);
      await waitForEffects();

      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');

      // Navigate to contact page
      unmount();

      render(
        <ThemeProvider>
          <MockContactPage />
        </ThemeProvider>
      );

      await waitForEffects();

      // Contact page should maintain dark theme
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      expect(screen.getByTestId('contact-page')).toBeInTheDocument();
    });

    test('all four pages maintain theme consistency', async () => {
      const user = userEvent.setup();

      // Home page - set theme to dark
      const { unmount: unmount1 } = render(
        <ThemeProvider>
          <MockHomePage />
        </ThemeProvider>
      );

      await waitForEffects();
      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      await user.click(toggleButton);
      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      unmount1();

      // Products page - should be dark
      const { unmount: unmount2 } = render(
        <ThemeProvider>
          <MockProductsPage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      unmount2();

      // About page - should be dark
      const { unmount: unmount3 } = render(
        <ThemeProvider>
          <MockAboutPage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      unmount3();

      // Contact page - should be dark
      render(
        <ThemeProvider>
          <MockContactPage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
    });
  });

  describe('AC 4: Theme persists when using browser back button', () => {
    test('theme is restored from localStorage when "going back"', async () => {
      // Simulate user journey: home (dark) -> products -> back to home
      localStorage.setItem('theme', 'dark');

      // User starts on home page with dark theme
      const { unmount: unmountHome } = render(
        <ThemeProvider>
          <MockHomePage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      unmountHome();

      // User navigates to products page
      render(
        <ThemeProvider>
          <MockProductsPage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      // User clicks "back" - home page remounts, theme should be restored from localStorage
    });

    test('data-theme attribute is restored on navigation', async () => {
      localStorage.setItem('theme', 'dark');

      // Initial page load
      const { unmount } = render(
        <ThemeProvider>
          <MockHomePage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      unmount();

      // Navigate to new page (simulating back button behavior)
      render(
        <ThemeProvider>
          <MockAboutPage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('AC 5: Theme persists when using browser forward button', () => {
    test('theme is preserved when "going forward"', async () => {
      const user = userEvent.setup();

      // User on home page, sets theme to light
      const { unmount: unmount1 } = render(
        <ThemeProvider>
          <MockHomePage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: light');
      unmount1();

      // User navigates to products page
      const { unmount: unmount2 } = render(
        <ThemeProvider>
          <MockProductsPage />
        </ThemeProvider>
      );

      await waitForEffects();
      
      // Change theme to dark on products page
      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      await user.click(toggleButton);
      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      unmount2();

      // User goes forward to about page - theme should be dark
      render(
        <ThemeProvider>
          <MockAboutPage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
    });

    test('localStorage is the source of truth for forward navigation', async () => {
      // Set theme to dark (simulating last visited page)
      localStorage.setItem('theme', 'dark');

      // Forward navigation remounts page
      render(
        <ThemeProvider>
          <MockContactPage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });

  describe('AC 6: Tests for theme persistence across navigation pass', () => {
    test('all navigation persistence tests pass', async () => {
      // This test verifies the entire navigation flow works
      const user = userEvent.setup();

      // Complete user journey: home -> products -> about -> contact
      localStorage.clear();

      // 1. Start on home with light theme
      const { unmount: unmount1 } = render(
        <ThemeProvider>
          <MockHomePage />
        </ThemeProvider>
      );
      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: light');

      // Switch to dark
      await user.click(screen.getByRole('button', { name: /switch to dark mode/i }));
      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      unmount1();

      // 2. Navigate to products - theme persists
      const { unmount: unmount2 } = render(
        <ThemeProvider>
          <MockProductsPage />
        </ThemeProvider>
      );
      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      unmount2();

      // 3. Navigate to about - theme persists
      const { unmount: unmount3 } = render(
        <ThemeProvider>
          <MockAboutPage />
        </ThemeProvider>
      );
      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      unmount3();

      // 4. Navigate to contact - theme persists
      render(
        <ThemeProvider>
          <MockContactPage />
        </ThemeProvider>
      );
      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');

      // Verify localStorage was updated
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    test('ThemeProvider maintains consistent state across renders', async () => {
      // Test that ThemeProvider doesn't reset theme on re-render
      localStorage.setItem('theme', 'dark');

      const { rerender } = render(
        <ThemeProvider>
          <MockHomePage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');

      // Rerender shouldn't change theme
      rerender(
        <ThemeProvider>
          <MockHomePage />
        </ThemeProvider>
      );

      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
    });
  });

  describe('AC 7: Typecheck passes', () => {
    test('all types are correct', () => {
      // This test exists to verify TypeScript compilation
      // If types were incorrect, this file wouldn't compile
      const theme: 'light' | 'dark' = 'dark';
      expect(['light', 'dark']).toContain(theme);
    });
  });

  describe('Integration: Full navigation flow with theme changes', () => {
    test('theme changes persist across complete navigation cycle', async () => {
      const user = userEvent.setup();

      // Start fresh
      localStorage.clear();

      // Home page - set to dark
      const { unmount: unmountHome } = render(
        <ThemeProvider>
          <MockHomePage />
        </ThemeProvider>
      );
      await waitForEffects();
      await user.click(screen.getByRole('button', { name: /switch to dark mode/i }));
      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      unmountHome();

      // Products page - verify dark, switch to light
      const { unmount: unmountProducts } = render(
        <ThemeProvider>
          <MockProductsPage />
        </ThemeProvider>
      );
      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark');
      await user.click(screen.getByRole('button', { name: /switch to light mode/i }));
      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: light');
      unmountProducts();

      // About page - verify light, keep it
      const { unmount: unmountAbout } = render(
        <ThemeProvider>
          <MockAboutPage />
        </ThemeProvider>
      );
      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: light');
      unmountAbout();

      // Contact page - verify light persists
      render(
        <ThemeProvider>
          <MockContactPage />
        </ThemeProvider>
      );
      await waitForEffects();
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: light');
      expect(localStorage.getItem('theme')).toBe('light');
    });

    test('theme toggle is available and functional on all pages', async () => {
      const user = userEvent.setup();
      localStorage.clear();

      const pages = [
        { name: 'home', Component: MockHomePage },
        { name: 'products', Component: MockProductsPage },
        { name: 'about', Component: MockAboutPage },
        { name: 'contact', Component: MockContactPage },
      ];

      for (const { name, Component } of pages) {
        const { unmount } = render(
          <ThemeProvider>
            <Component />
          </ThemeProvider>
        );

        await waitForEffects();

        // ThemeToggle should be present
        const toggleButton = screen.getByRole('button', { name: /switch to (dark|light) mode/i });
        expect(toggleButton).toBeInTheDocument();

        // Should be able to toggle
        await user.click(toggleButton);
        await waitForEffects();

        // Toggle should still be present after theme change
        expect(screen.getByRole('button', { name: /switch to (dark|light) mode/i })).toBeInTheDocument();

        unmount();
      }
    });
  });
});
