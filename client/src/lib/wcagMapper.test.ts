import { describe, it, expect } from 'vitest';
import { getWcagCriterion, getWcagLevel } from './wcagMapper';

describe('wcagMapper', () => {
  it('should return human readable string from tag', () => {
    expect(getWcagCriterion(['wcag111', 'wcag2a'])).toBe('1.1.1 Non-text Content (A)');
    expect(getWcagCriterion(['wcag143'])).toBe('1.4.3 Contrast (Minimum) (AA)');
  });

  it('should return correct WCAG level from tags', () => {
    expect(getWcagLevel(['wcag2a', 'wcag111'])).toBe('A');
    expect(getWcagLevel(['wcag2aa'])).toBe('AA');
    expect(getWcagLevel(['wcag2aaa'])).toBe('AAA');
    expect(getWcagLevel(['wcag143'])).toBe('AA'); // deduced from map
  });
});
