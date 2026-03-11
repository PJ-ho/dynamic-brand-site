/**
 * Tests for US-015: Add dark theme styles for custom scrollbar
 * 
 * Verifies that custom scrollbar styles work correctly in both light and dark themes
 */

import fs from 'fs';
import path from 'path';

describe('US-015: Dark Theme Scrollbar Styles', () => {
  let cssContent: string;

  beforeAll(() => {
    const cssPath = path.join(process.cwd(), 'src/styles/globals.css');
    cssContent = fs.readFileSync(cssPath, 'utf-8');
  });

  describe('AC 1: Dark theme scrollbar styles exist in globals.css', () => {
    it('should have [data-theme="dark"] ::-webkit-scrollbar selector', () => {
      expect(cssContent).toMatch(/\[data-theme="dark"\]\s*::-webkit-scrollbar/);
    });

    it('should have [data-theme="dark"] ::-webkit-scrollbar-track selector', () => {
      expect(cssContent).toMatch(/\[data-theme="dark"\]\s*::-webkit-scrollbar-track/);
    });

    it('should have [data-theme="dark"] ::-webkit-scrollbar-thumb selector', () => {
      expect(cssContent).toMatch(/\[data-theme="dark"\]\s*::-webkit-scrollbar-thumb/);
    });

    it('should have [data-theme="dark"] ::-webkit-scrollbar-thumb:hover selector', () => {
      expect(cssContent).toMatch(/\[data-theme="dark"\]\s*::-webkit-scrollbar-thumb:hover/);
    });
  });

  describe('AC 2: Scrollbar track uses dark theme color', () => {
    it('should use var(--color-cream) for scrollbar-track in dark theme', () => {
      const darkTrackMatch = cssContent.match(/\[data-theme="dark"\]\s*::-webkit-scrollbar-track[\s\S]*?{([\s\S]*?)}/);
      expect(darkTrackMatch).toBeTruthy();
      expect(darkTrackMatch![1]).toMatch(/background:\s*var\(--color-cream\)/);
    });

    it('should reference CSS variable for automatic theme adaptation', () => {
      const darkTrackMatch = cssContent.match(/\[data-theme="dark"\]\s*::-webkit-scrollbar-track[\s\S]*?{([\s\S]*?)}/);
      expect(darkTrackMatch).toBeTruthy();
      expect(darkTrackMatch![1]).toContain('var(--color-cream)');
    });
  });

  describe('AC 3: Scrollbar thumb uses dark theme accent color', () => {
    it('should use var(--color-tan) for scrollbar-thumb in dark theme', () => {
      const darkThumbMatch = cssContent.match(/\[data-theme="dark"\]\s*::-webkit-scrollbar-thumb[\s\S]*?{([\s\S]*?)}/);
      expect(darkThumbMatch).toBeTruthy();
      expect(darkThumbMatch![1]).toMatch(/background:\s*var\(--color-tan\)/);
    });

    it('should have border-radius for scrollbar-thumb in dark theme', () => {
      const darkThumbMatch = cssContent.match(/\[data-theme="dark"\]\s*::-webkit-scrollbar-thumb[\s\S]*?{([\s\S]*?)}/);
      expect(darkThumbMatch).toBeTruthy();
      expect(darkThumbMatch![1]).toMatch(/border-radius:\s*4px/);
    });

    it('should use var(--color-gold) for scrollbar-thumb:hover in dark theme', () => {
      const darkThumbHoverMatch = cssContent.match(/\[data-theme="dark"\]\s*::-webkit-scrollbar-thumb:hover[\s\S]*?{([\s\S]*?)}/);
      expect(darkThumbHoverMatch).toBeTruthy();
      expect(darkThumbHoverMatch![1]).toMatch(/background:\s*var\(--color-gold\)/);
    });
  });

  describe('AC 4: Scrollbar is visible and usable in dark mode', () => {
    it('should have width defined for dark theme scrollbar', () => {
      const darkScrollbarMatch = cssContent.match(/\[data-theme="dark"\]\s*::-webkit-scrollbar[\s\S]*?{([\s\S]*?)}/);
      expect(darkScrollbarMatch).toBeTruthy();
      expect(darkScrollbarMatch![1]).toMatch(/width:\s*8px/);
    });

    it('should maintain consistent width between light and dark themes', () => {
      const lightScrollbarMatch = cssContent.match(/\/\* Custom scrollbar \*\/[\s\S]*?::-webkit-scrollbar[\s\S]*?{([\s\S]*?)}/);
      const darkScrollbarMatch = cssContent.match(/\[data-theme="dark"\]\s*::-webkit-scrollbar[\s\S]*?{([\s\S]*?)}/);
      
      expect(lightScrollbarMatch).toBeTruthy();
      expect(darkScrollbarMatch).toBeTruthy();
      
      // Both should have width: 8px
      expect(lightScrollbarMatch![1]).toMatch(/width:\s*8px/);
      expect(darkScrollbarMatch![1]).toMatch(/width:\s*8px/);
    });

    it('should have sufficient contrast in dark theme colors', () => {
      // Dark theme colors defined in [data-theme="dark"]
      const darkThemeMatch = cssContent.match(/\[data-theme="dark"\][\s\S]*?{([\s\S]*?)}/);
      expect(darkThemeMatch).toBeTruthy();
      
      const darkThemeBlock = darkThemeMatch![1];
      
      // Verify dark theme has inverted colors (cream is dark, espresso is light)
      expect(darkThemeBlock).toMatch(/--color-cream:\s*#2A1810/); // Dark background
      expect(darkThemeBlock).toMatch(/--color-tan:\s*#8B7355/); // Muted tan for scrollbar
      expect(darkThemeBlock).toMatch(/--color-gold:\s*#DAA520/); // Bright gold for hover
    });
  });

  describe('AC 5: Tests for scrollbar styles pass', () => {
    it('should have all required scrollbar selectors', () => {
      expect(cssContent).toContain('::-webkit-scrollbar');
      expect(cssContent).toContain('::-webkit-scrollbar-track');
      expect(cssContent).toContain('::-webkit-scrollbar-thumb');
      expect(cssContent).toContain('::-webkit-scrollbar-thumb:hover');
    });

    it('should have dark theme variants for all scrollbar selectors', () => {
      expect(cssContent).toMatch(/\[data-theme="dark"\]\s*::-webkit-scrollbar/);
      expect(cssContent).toMatch(/\[data-theme="dark"\]\s*::-webkit-scrollbar-track/);
      expect(cssContent).toMatch(/\[data-theme="dark"\]\s*::-webkit-scrollbar-thumb/);
      expect(cssContent).toMatch(/\[data-theme="dark"\]\s*::-webkit-scrollbar-thumb:hover/);
    });
  });

  describe('Additional: Scrollbar integration with theme system', () => {
    it('should reference CSS custom properties for theme adaptation', () => {
      // Light theme scrollbar
      expect(cssContent).toMatch(/::-webkit-scrollbar-track[\s\S]*?background:\s*var\(--color-cream\)/);
      expect(cssContent).toMatch(/::-webkit-scrollbar-thumb[\s\S]*?background:\s*var\(--color-tan\)/);
      
      // Dark theme scrollbar
      expect(cssContent).toMatch(/\[data-theme="dark"\][\s\S]*?::-webkit-scrollbar-track[\s\S]*?background:\s*var\(--color-cream\)/);
      expect(cssContent).toMatch(/\[data-theme="dark"\][\s\S]*?::-webkit-scrollbar-thumb[\s\S]*?background:\s*var\(--color-tan\)/);
    });

    it('should have smooth transitions for light theme scrollbar', () => {
      const lightTrackMatch = cssContent.match(/\/\* Custom scrollbar \*\/[\s\S]*?::-webkit-scrollbar-track[\s\S]*?{([\s\S]*?)}/);
      expect(lightTrackMatch).toBeTruthy();
      expect(lightTrackMatch![1]).toMatch(/transition/);
      
      const lightThumbMatch = cssContent.match(/\/\* Custom scrollbar \*\/[\s\S]*?::-webkit-scrollbar-thumb[\s\S]*?{([\s\S]*?)}/);
      expect(lightThumbMatch).toBeTruthy();
      expect(lightThumbMatch![1]).toMatch(/transition/);
    });

    it('should follow existing pattern for dark theme selectors', () => {
      // Should follow the same pattern as [data-theme="dark"] .glass
      expect(cssContent).toMatch(/\[data-theme="dark"\]\s*\.glass/);
      expect(cssContent).toMatch(/\[data-theme="dark"\]\s*::-webkit-scrollbar/);
    });
  });
});
