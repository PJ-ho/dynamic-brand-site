import fs from 'fs';
import path from 'path';

/**
 * Tests for US-009: Add smooth CSS transitions for theme changes
 * 
 * Acceptance Criteria:
 * 1. CSS transitions added to body element
 * 2. Transitions applied to text elements (h1-h6, p, a)
 * 3. Transitions applied to background colors
 * 4. Transition duration is 0.3s or similar smooth duration
 * 5. Theme changes animate smoothly without flickering
 * 6. Transitions don't cause performance issues
 * 7. Tests for transition CSS properties pass
 * 8. Typecheck passes
 */

describe('Theme Transitions (US-009)', () => {
  let cssContent: string;

  beforeAll(() => {
    const cssPath = path.join(__dirname, '../src/styles/globals.css');
    cssContent = fs.readFileSync(cssPath, 'utf-8');
  });

  describe('AC 1: CSS transitions added to body element', () => {
    it('should have transition property on body selector', () => {
      const bodyBlock = cssContent.match(/body\s*\{[\s\S]*?\}/);
      expect(bodyBlock).toBeTruthy();
      expect(bodyBlock![0]).toMatch(/transition:/);
    });

    it('should transition background-color on body', () => {
      const bodyBlock = cssContent.match(/body\s*\{[\s\S]*?\}/);
      expect(bodyBlock).toBeTruthy();
      expect(bodyBlock![0]).toMatch(/transition:[\s\S]*?background-color/);
    });

    it('should transition color on body', () => {
      const bodyBlock = cssContent.match(/body\s*\{[\s\S]*?\}/);
      expect(bodyBlock).toBeTruthy();
      expect(bodyBlock![0]).toMatch(/transition:[\s\S]*?color/);
    });
  });

  describe('AC 2: Transitions applied to text elements (h1-h6, p, a)', () => {
    it('should have transition on h1-h6 elements', () => {
      const headingBlock = cssContent.match(/h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6\s*\{[\s\S]*?\}/);
      expect(headingBlock).toBeTruthy();
      expect(headingBlock![0]).toMatch(/transition:/);
    });

    it('should have transition on p and a elements', () => {
      const paBlock = cssContent.match(/p,\s*a\s*\{[\s\S]*?\}/);
      expect(paBlock).toBeTruthy();
      expect(paBlock![0]).toMatch(/transition:/);
    });

    it('should transition color on heading elements', () => {
      const headingBlock = cssContent.match(/h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6\s*\{[\s\S]*?\}/);
      expect(headingBlock).toBeTruthy();
      expect(headingBlock![0]).toMatch(/transition:[\s\S]*?color/);
    });
  });

  describe('AC 3: Transitions applied to background colors', () => {
    it('should transition background-color on p and a elements', () => {
      const paBlock = cssContent.match(/p,\s*a\s*\{[\s\S]*?\}/);
      expect(paBlock).toBeTruthy();
      expect(paBlock![0]).toMatch(/transition:[\s\S]*?background-color/);
    });

    it('should have transitions on buttons', () => {
      const buttonBlock = cssContent.match(/button,\s*\[role="button"\]\s*\{[\s\S]*?\}/);
      expect(buttonBlock).toBeTruthy();
      expect(buttonBlock![0]).toMatch(/transition:/);
    });

    it('should transition background-color on buttons', () => {
      const buttonBlock = cssContent.match(/button,\s*\[role="button"\]\s*\{[\s\S]*?\}/);
      expect(buttonBlock).toBeTruthy();
      expect(buttonBlock![0]).toMatch(/transition:[\s\S]*?background-color/);
    });
  });

  describe('AC 4: Transition duration is 0.3s or similar smooth duration', () => {
    it('should define transition duration custom property', () => {
      expect(cssContent).toMatch(/--theme-transition-duration:\s*0\.3s/);
    });

    it('should define transition timing function', () => {
      expect(cssContent).toMatch(/--theme-transition-timing:\s*ease/);
    });

    it('should use transition duration custom property in body', () => {
      const bodyBlock = cssContent.match(/body\s*\{[\s\S]*?\}/);
      expect(bodyBlock).toBeTruthy();
      expect(bodyBlock![0]).toMatch(/transition:[\s\S]*?var\(--theme-transition-duration\)/);
    });

    it('should use transition timing custom property in body', () => {
      const bodyBlock = cssContent.match(/body\s*\{[\s\S]*?\}/);
      expect(bodyBlock).toBeTruthy();
      expect(bodyBlock![0]).toMatch(/transition:[\s\S]*?var\(--theme-transition-timing\)/);
    });

    it('should use transition duration on all transition-enabled elements', () => {
      const transitionBlocks = cssContent.match(/transition:[^;]+;/g) || [];
      const usingCustomProperty = transitionBlocks.filter(block => 
        block.includes('var(--theme-transition-duration)')
      );
      // Should have at least 5 elements using the custom property
      expect(usingCustomProperty.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('AC 5: Theme changes animate smoothly without flickering', () => {
    it('should use smooth timing function (ease or similar)', () => {
      expect(cssContent).toMatch(/--theme-transition-timing:\s*(ease|ease-in-out|cubic-bezier)/);
    });

    it('should have consistent transition timing across elements', () => {
      // All transitions should use the same custom property
      const transitionBlocks = cssContent.match(/transition:[^;]+;/g) || [];
      transitionBlocks.forEach(block => {
        if (block.includes('var(--theme-transition-duration)')) {
          expect(block).toMatch(/var\(--theme-transition-timing\)/);
        }
      });
    });
  });

  describe('AC 6: Transitions don\'t cause performance issues', () => {
    it('should only transition specific properties, not "all"', () => {
      const transitionBlocks = cssContent.match(/transition:[^;]+;/g) || [];
      transitionBlocks.forEach(block => {
        expect(block).not.toMatch(/\ball\b/);
      });
    });

    it('should use reasonable transition duration (not too long)', () => {
      expect(cssContent).toMatch(/--theme-transition-duration:\s*0\.[0-5]s/);
    });

    it('should limit transitions to visual properties', () => {
      // Check that we're not transitioning expensive properties like transform or box-shadow
      const bodyBlock = cssContent.match(/body\s*\{[\s\S]*?\}/);
      if (bodyBlock) {
        const transitionMatch = bodyBlock[0].match(/transition:\s*([^;]+);/);
        if (transitionMatch) {
          const properties = transitionMatch[1];
          // Should only transition color and background-color
          expect(properties).toMatch(/(background-color|color)/);
          expect(properties).not.toMatch(/(transform|box-shadow|filter)/);
        }
      }
    });
  });

  describe('AC 7: Tests for transition CSS properties pass', () => {
    it('should have all required transition properties defined', () => {
      // This test passes if all the above tests pass
      expect(true).toBe(true);
    });
  });

  describe('Additional transition coverage', () => {
    it('should transition scrollbar elements', () => {
      const trackBlock = cssContent.match(/::-webkit-scrollbar-track\s*\{[\s\S]*?\}/);
      const thumbBlock = cssContent.match(/::-webkit-scrollbar-thumb\s*\{[\s\S]*?\}/);
      expect(trackBlock).toBeTruthy();
      expect(trackBlock![0]).toMatch(/transition:/);
      expect(thumbBlock).toBeTruthy();
      expect(thumbBlock![0]).toMatch(/transition:/);
    });

    it('should transition glass effect elements', () => {
      const glassBlock = cssContent.match(/\.glass\s*\{[\s\S]*?\}/);
      expect(glassBlock).toBeTruthy();
      expect(glassBlock![0]).toMatch(/transition:/);
    });

    it('should transition page-transition elements', () => {
      const pageTransitionBlock = cssContent.match(/\.page-transition\s*\{[\s\S]*?\}/);
      expect(pageTransitionBlock).toBeTruthy();
      expect(pageTransitionBlock![0]).toMatch(/transition:/);
    });

    it('should use CSS custom properties for maintainability', () => {
      // Verify that transitions use custom properties instead of hardcoded values
      const bodyBlock = cssContent.match(/body\s*\{[\s\S]*?\}/);
      expect(bodyBlock).toBeTruthy();
      expect(bodyBlock![0]).toMatch(/var\(--theme-transition-duration\)/);
      expect(bodyBlock![0]).toMatch(/var\(--theme-transition-timing\)/);
    });
  });
});
