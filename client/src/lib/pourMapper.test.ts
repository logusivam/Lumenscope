import { describe, it, expect } from 'vitest';
import { getPourPrinciple } from './pourMapper';

describe('pourMapper', () => {
  it('should resolve correct POUR principle from tags', () => {
    expect(getPourPrinciple(['cat.text-alternatives'])).toBe('perceivable');
    expect(getPourPrinciple(['cat.keyboard'])).toBe('operable');
    expect(getPourPrinciple(['cat.language'])).toBe('understandable');
    expect(getPourPrinciple(['cat.name-role-value'])).toBe('robust');
  });
});
