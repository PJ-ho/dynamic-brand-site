/**
 * Tests for verifying the test infrastructure setup.
 */

import '@testing-library/jest-dom';

describe('Test Infrastructure Setup', () => {
  it('should have @testing-library/jest-dom matchers available', () => {
    // Test that jest-dom matchers are available
    const element = document.createElement('div');
    element.textContent = 'Hello World';
    document.body.appendChild(element);
    
    // This uses the toBeInTheDocument matcher from @testing-library/jest-dom
    expect(element).toBeInTheDocument();
    
    // Cleanup
    document.body.removeChild(element);
  });

  it('should have jsdom environment configured', () => {
    // Verify we're in a jsdom environment
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
    expect(typeof navigator).toBe('object');
  });

  it('should support TypeScript in tests', () => {
    const greeting: string = 'Hello, TypeScript!';
    expect(typeof greeting).toBe('string');
    expect(greeting).toContain('TypeScript');
  });
});
