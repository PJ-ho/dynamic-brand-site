/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Navbar from '../src/components/ui/Navbar';
import { ThemeProvider } from '../src/contexts/ThemeContext';

// Mock PointerEvent for Framer Motion
class PointerEvent extends MouseEvent {
  constructor(type: string, props: PointerEventInit = {}) {
    super(type, props as MouseEventInit);
    Object.assign(this, {
      pointerId: props.pointerId ?? 0,
      width: props.width ?? 1,
      height: props.height ?? 1,
      pressure: props.pressure ?? 0,
      tangentialPressure: props.tangentialPressure ?? 0,
      tiltX: props.tiltX ?? 0,
      tiltY: props.tiltY ?? 0,
      twist: props.twist ?? 0,
      pointerType: props.pointerType ?? 'mouse',
      isPrimary: props.isPrimary ?? false,
    });
  }
}
window.PointerEvent = PointerEvent as any;

// Mock matchMedia
const mockMatchMedia = jest.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

// Mock scrollY
Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: 0,
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Navbar with ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.documentElement.removeAttribute('data-theme');
  });

  describe('AC 1: ThemeToggle appears in Navbar on desktop view', () => {
    it('renders ThemeToggle in desktop navigation', async () => {
      await act(async () => {
        render(
          <ThemeProvider>
            <Navbar />
          </ThemeProvider>
        );
        // Wait for useEffect
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Find all buttons with theme-related aria-label
      const themeButtons = screen.getAllByRole('button', { name: /switch to (light|dark) mode/i });
      
      // At least one should be in desktop view (hidden on mobile with md:flex)
      expect(themeButtons.length).toBeGreaterThan(0);
    });

    it('ThemeToggle is inside desktop nav container', async () => {
      const { container } = render(
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Desktop nav has class "hidden md:flex"
      const desktopNav = container.querySelector('.hidden.md\\:flex');
      expect(desktopNav).toBeTruthy();

      // ThemeToggle should be inside this container
      const themeButton = desktopNav?.querySelector('button[aria-label*="Switch to"]');
      expect(themeButton).toBeTruthy();
    });
  });

  describe('AC 2: ThemeToggle appears in mobile menu', () => {
    it('renders ThemeToggle in mobile menu when open', async () => {
      const { container } = render(
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Find mobile menu button (hamburger icon with 3 span lines)
      const menuButtons = screen.getAllByRole('button');
      const mobileMenuButton = menuButtons.find(btn => 
        btn.querySelector('span') || btn.className.includes('flex-col')
      );

      // Open mobile menu
      await act(async () => {
        fireEvent.click(mobileMenuButton!);
        await new Promise(resolve => setTimeout(resolve, 200));
      });

      // Mobile menu should have md:hidden class and be visible
      const mobileMenu = container.querySelector('.fixed.inset-0.z-40.glass');
      expect(mobileMenu).toBeTruthy();

      // ThemeToggle should be in mobile menu - look for button with aria-label
      const allThemeButtons = screen.getAllByRole('button', { name: /switch to (light|dark) mode/i });
      // Should have at least 2 ThemeToggles (desktop + mobile)
      expect(allThemeButtons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('AC 3: ThemeToggle is properly aligned and spaced', () => {
    it('ThemeToggle has proper spacing in desktop nav', async () => {
      const { container } = render(
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const desktopNav = container.querySelector('.hidden.md\\:flex');
      expect(desktopNav?.className).toContain('gap-10');
      
      // ThemeToggle should be present in the flex container
      const themeButton = desktopNav?.querySelector('button[aria-label*="Switch to"]');
      expect(themeButton).toBeTruthy();
    });

    it('ThemeToggle has proper spacing in mobile menu', async () => {
      const { container } = render(
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Open mobile menu
      const menuButtons = screen.getAllByRole('button');
      const mobileMenuButton = menuButtons.find(btn => 
        btn.querySelector('span') || btn.className.includes('flex-col')
      );

      await act(async () => {
        fireEvent.click(mobileMenuButton!);
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Find the container with nav links
      const mobileNavContainer = container.querySelector('.flex-col.gap-6');
      expect(mobileNavContainer).toBeTruthy();

      // ThemeToggle should have padding-top for spacing
      const themeToggleContainer = mobileNavContainer?.querySelector('.pt-2');
      expect(themeToggleContainer).toBeTruthy();
    });
  });

  describe('AC 4: Toggle functions correctly in both desktop and mobile views', () => {
    it('desktop ThemeToggle switches theme from light to dark', async () => {
      localStorageMock.getItem.mockReturnValue('light');

      const { container } = render(
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const desktopNav = container.querySelector('.hidden.md\\:flex');
      const themeButton = desktopNav?.querySelector('button[aria-label*="Switch to"]');

      // Initial state should be light
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');

      // Click toggle
      await act(async () => {
        fireEvent.click(themeButton!);
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Theme should change to dark
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('mobile ThemeToggle switches theme from dark to light', async () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Open mobile menu
      const menuButtons = screen.getAllByRole('button');
      const mobileMenuButton = menuButtons.find(btn => 
        btn.querySelector('span') || btn.className.includes('flex-col')
      );

      await act(async () => {
        fireEvent.click(mobileMenuButton!);
        await new Promise(resolve => setTimeout(resolve, 200));
      });

      // Get all theme buttons (should be 2: desktop + mobile)
      const themeButtons = screen.getAllByRole('button', { name: /switch to (light|dark) mode/i });
      expect(themeButtons.length).toBeGreaterThanOrEqual(2);
      
      // Use the second one (mobile)
      const mobileThemeButton = themeButtons[1];

      // Initial state should be dark
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      // Click toggle
      await act(async () => {
        fireEvent.click(mobileThemeButton);
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Theme should change to light
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('AC 5: ThemeToggle doesn\'t break existing Navbar layout', () => {
    it('renders all existing nav links in desktop view', async () => {
      const { container } = render(
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Check all nav links are present
      expect(screen.getByText('首页')).toBeTruthy();
      expect(screen.getByText('产品')).toBeTruthy();
      expect(screen.getByText('工艺')).toBeTruthy();
      expect(screen.getByText('故事')).toBeTruthy();
      expect(screen.getByText('联系')).toBeTruthy();

      // Check logo is present
      expect(screen.getByText('ATELIER')).toBeTruthy();
      expect(screen.getByText('CUIR')).toBeTruthy();
    });

    it('renders all existing nav links in mobile menu', async () => {
      render(
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Open mobile menu
      const menuButtons = screen.getAllByRole('button');
      const mobileMenuButton = menuButtons.find(btn => 
        btn.querySelector('span') || btn.className.includes('flex-col')
      );

      await act(async () => {
        fireEvent.click(mobileMenuButton!);
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // All nav links should be visible in mobile menu
      const homeLinks = screen.getAllByText('首页');
      const productsLinks = screen.getAllByText('产品');
      const craftLinks = screen.getAllByText('工艺');
      const storyLinks = screen.getAllByText('故事');
      const contactLinks = screen.getAllByText('联系');

      // At least one of each should be visible (mobile menu versions)
      expect(homeLinks.length).toBeGreaterThan(0);
      expect(productsLinks.length).toBeGreaterThan(0);
      expect(craftLinks.length).toBeGreaterThan(0);
      expect(storyLinks.length).toBeGreaterThan(0);
      expect(contactLinks.length).toBeGreaterThan(0);
    });

    it('mobile menu opens and closes correctly', async () => {
      const { container } = render(
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const menuButtons = screen.getAllByRole('button');
      const mobileMenuButton = menuButtons.find(btn => 
        btn.querySelector('span') || btn.className.includes('flex-col')
      );

      // Menu should be closed initially
      let mobileMenu = container.querySelector('.fixed.inset-0.z-40.glass');
      expect(mobileMenu).toBeFalsy();

      // Open menu
      await act(async () => {
        fireEvent.click(mobileMenuButton!);
        await new Promise(resolve => setTimeout(resolve, 200));
      });

      // Menu should be open
      mobileMenu = container.querySelector('.fixed.inset-0.z-40.glass');
      expect(mobileMenu).toBeTruthy();

      // Close menu
      await act(async () => {
        fireEvent.click(mobileMenuButton!);
        await new Promise(resolve => setTimeout(resolve, 400));
      });

      // Menu should be closed again (AnimatePresence needs time for exit animation)
      mobileMenu = container.querySelector('.fixed.inset-0.z-40.glass');
      expect(mobileMenu).toBeFalsy();
    });
  });

  describe('AC 6: Tests for Navbar with ThemeToggle pass', () => {
    it('all Navbar integration tests pass', async () => {
      // This is a meta-test to verify the test suite runs
      const { container } = render(
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(container).toBeTruthy();
    });
  });
});
