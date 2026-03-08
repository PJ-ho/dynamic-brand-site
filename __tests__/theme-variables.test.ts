/**
 * Tests for dark theme CSS variables (US-002)
 * Verifies that dark theme is properly defined with all required variables
 */

import fs from 'fs';
import path from 'path';

describe('Theme Variables', () => {
  const globalsPath = path.join(__dirname, '../src/styles/globals.css');
  let cssContent: string;

  beforeAll(() => {
    cssContent = fs.readFileSync(globalsPath, 'utf-8');
  });

  describe('Light Theme (:root)', () => {
    it('should define all brand color variables', () => {
      expect(cssContent).toMatch(/--color-cream:\s*#[0-9A-Fa-f]{6}/);
      expect(cssContent).toMatch(/--color-tan:\s*#[0-9A-Fa-f]{6}/);
      expect(cssContent).toMatch(/--color-leather:\s*#[0-9A-Fa-f]{6}/);
      expect(cssContent).toMatch(/--color-brown:\s*#[0-9A-Fa-f]{6}/);
      expect(cssContent).toMatch(/--color-espresso:\s*#[0-9A-Fa-f]{6}/);
      expect(cssContent).toMatch(/--color-charcoal:\s*#[0-9A-Fa-f]{6}/);
      expect(cssContent).toMatch(/--color-gold:\s*#[0-9A-Fa-f]{6}/);
    });

    it('should define typography variables', () => {
      expect(cssContent).toContain('--font-serif:');
      expect(cssContent).toContain('--font-sans:');
    });
  });

  describe('Dark Theme ([data-theme="dark"])', () => {
    it('should have [data-theme="dark"] selector', () => {
      expect(cssContent).toContain('[data-theme="dark"]');
    });

    it('should define all brand color variables in dark theme', () => {
      const darkThemeMatch = cssContent.match(/\[data-theme="dark"\s*\]\s*{([^}]+)}/);
      expect(darkThemeMatch).toBeTruthy();
      
      const darkThemeBlock = darkThemeMatch![1];
      
      // Check all color variables are redefined
      expect(darkThemeBlock).toMatch(/--color-cream:\s*#[0-9A-Fa-f]{6}/);
      expect(darkThemeBlock).toMatch(/--color-tan:\s*#[0-9A-Fa-f]{6}/);
      expect(darkThemeBlock).toMatch(/--color-leather:\s*#[0-9A-Fa-f]{6}/);
      expect(darkThemeBlock).toMatch(/--color-brown:\s*#[0-9A-Fa-f]{6}/);
      expect(darkThemeBlock).toMatch(/--color-espresso:\s*#[0-9A-Fa-f]{6}/);
      expect(darkThemeBlock).toMatch(/--color-charcoal:\s*#[0-9A-Fa-f]{6}/);
      expect(darkThemeBlock).toMatch(/--color-gold:\s*#[0-9A-Fa-f]{6}/);
    });

    it('should have inverted color values for cream and espresso', () => {
      const darkThemeMatch = cssContent.match(/\[data-theme="dark"\s*\]\s*{([^}]+)}/);
      const darkThemeBlock = darkThemeMatch![1];
      
      // Extract dark theme cream and espresso values
      const darkCreamMatch = darkThemeBlock.match(/--color-cream:\s*(#[0-9A-Fa-f]{6})/);
      const darkEspressoMatch = darkThemeBlock.match(/--color-espresso:\s*(#[0-9A-Fa-f]{6})/);
      
      expect(darkCreamMatch).toBeTruthy();
      expect(darkEspressoMatch).toBeTruthy();
      
      const darkCream = darkCreamMatch![1];
      const darkEspresso = darkEspressoMatch![1];
      
      // In dark theme, cream should be dark and espresso should be light
      // Dark colors have low brightness (first digit of hex is low)
      expect(darkCream).toMatch(/^#[0-6]/); // Dark background (0-6 in first position)
      expect(darkEspresso).toMatch(/^#[A-Fa-fD-F]/); // Light text (D-F in first position)
    });
  });

  describe('Color Contrast (WCAG AA)', () => {
    /**
     * Calculate relative luminance of a hex color
     * Based on WCAG 2.1 definition
     */
    function getLuminance(hex: string): number {
      const rgb = hex.match(/[0-9A-Fa-f]{2}/g)?.map(x => parseInt(x, 16) / 255) || [];
      if (rgb.length !== 3) return 0;
      
      const [r, g, b] = rgb.map(c => 
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      );
      
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    /**
     * Calculate contrast ratio between two colors
     */
    function getContrastRatio(color1: string, color2: string): number {
      const L1 = getLuminance(color1);
      const L2 = getLuminance(color2);
      const lighter = Math.max(L1, L2);
      const darker = Math.min(L1, L2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    it('should provide sufficient contrast in dark theme (WCAG AA minimum 4.5:1)', () => {
      const darkThemeMatch = cssContent.match(/\[data-theme="dark"\s*\]\s*{([^}]+)}/);
      const darkThemeBlock = darkThemeMatch![1];
      
      const darkCreamMatch = darkThemeBlock.match(/--color-cream:\s*(#[0-9A-Fa-f]{6})/);
      const darkEspressoMatch = darkThemeBlock.match(/--color-espresso:\s*(#[0-9A-Fa-f]{6})/);
      
      const darkCream = darkCreamMatch![1];
      const darkEspresso = darkEspressoMatch![1];
      
      const contrastRatio = getContrastRatio(darkCream, darkEspresso);
      
      // WCAG AA requires at least 4.5:1 for normal text
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
    });

    it('should provide sufficient contrast in light theme (WCAG AA minimum 4.5:1)', () => {
      const lightThemeMatch = cssContent.match(/:root\s*{([^}]+)}/);
      const lightThemeBlock = lightThemeMatch![1];
      
      const lightCreamMatch = lightThemeBlock.match(/--color-cream:\s*(#[0-9A-Fa-f]{6})/);
      const lightEspressoMatch = lightThemeBlock.match(/--color-espresso:\s*(#[0-9A-Fa-f]{6})/);
      
      const lightCream = lightCreamMatch![1];
      const lightEspresso = lightEspressoMatch![1];
      
      const contrastRatio = getContrastRatio(lightCream, lightEspresso);
      
      // WCAG AA requires at least 4.5:1 for normal text
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Tailwind Integration', () => {
    it('should have @theme inline block for Tailwind', () => {
      expect(cssContent).toContain('@theme inline');
    });

    it('should reference all color variables in @theme block', () => {
      const themeBlockMatch = cssContent.match(/@theme\s+inline\s*{([^}]+)}/);
      expect(themeBlockMatch).toBeTruthy();
      
      const themeBlock = themeBlockMatch![1];
      
      expect(themeBlock).toContain('--color-cream: var(--color-cream)');
      expect(themeBlock).toContain('--color-tan: var(--color-tan)');
      expect(themeBlock).toContain('--color-leather: var(--color-leather)');
      expect(themeBlock).toContain('--color-brown: var(--color-brown)');
      expect(themeBlock).toContain('--color-espresso: var(--color-espresso)');
      expect(themeBlock).toContain('--color-charcoal: var(--color-charcoal)');
      expect(themeBlock).toContain('--color-gold: var(--color-gold)');
    });
  });

  describe('Body Styles', () => {
    it('should use CSS variables for body background and text color', () => {
      expect(cssContent).toMatch(/background-color:\s*var\(--color-cream\)/);
      expect(cssContent).toMatch(/color:\s*var\(--color-espresso\)/);
    });
  });
});
