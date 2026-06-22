import { describe, it, expect } from 'vitest';
import { useViolationFilter } from './useViolationFilter';

describe('useViolationFilter placeholder', () => {
  it('runs', () => {
    expect(useViolationFilter()).toBeNull();
  });
});
