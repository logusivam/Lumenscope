import { describe, it, expect } from 'vitest';
import { useHighlight } from './useHighlight';

describe('useHighlight placeholder', () => {
  it('runs', () => {
    expect(useHighlight()).toBeNull();
  });
});
