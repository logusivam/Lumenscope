import { describe, it, expect } from 'vitest';
import { calculateScore } from './scoreCalculator';
import { AxeViolation } from '../types/axe';

describe('scoreCalculator', () => {
  it('should return 100 for 0 violations', () => {
    const result = calculateScore([]);
    expect(result.score).toBe(100);
    expect(result.pour.perceivable).toBe(100);
    expect(result.wcag.A).toBe(0);
  });

  it('should subtract correct weighted score', () => {
    const mockViolations: AxeViolation[] = [
      {
        id: 'image-alt',
        impact: 'critical',
        tags: ['wcag2a', 'wcag111', 'cat.text-alternatives'],
        description: 'Ensure image tags have alt text',
        help: 'Alt text missing',
        helpUrl: 'http://example.com',
        nodes: [
          { any: [], all: [], none: [], impact: 'critical', html: '<img>', target: ['img'] },
          { any: [], all: [], none: [], impact: 'critical', html: '<img>', target: ['img'] },
          { any: [], all: [], none: [], impact: 'critical', html: '<img>', target: ['img'] }
        ]
      }
    ];

    const result = calculateScore(mockViolations);
    // Exponential decay: Math.round(100 * Math.exp(-30 / 80)) = 69
    expect(result.score).toBe(69);
    expect(result.pour.perceivable).toBe(69);
    expect(result.wcag.A).toBe(3);
  });
});
