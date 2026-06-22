import { describe, it, expect } from 'vitest';
import { useContrastRatio } from './useContrastRatio';

describe('useContrastRatio placeholder', () => {
  it('runs', () => {
    expect(useContrastRatio()).toBeNull();
  });
});
