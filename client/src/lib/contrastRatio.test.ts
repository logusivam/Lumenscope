import { describe, it, expect } from 'vitest';
import { calculateContrastRatio } from './contrastRatio';

describe('contrastRatio math', () => {
  it('calculates pure black and pure white correctly', () => {
    const result = calculateContrastRatio('#000000', '#ffffff');
    expect(result.ratio).toBe(21);
    expect(result.normalAA.pass).toBe(true);
    expect(result.normalAAA.pass).toBe(true);
  });

  it('calculates specific pairs correctly', () => {
    // #1A1D23 vs #F7F7F5 = 15.74:1
    const result = calculateContrastRatio('#1A1D23', '#F7F7F5');
    expect(result.ratio).toBe(15.74);
    expect(result.normalAA.pass).toBe(true);
  });
});
