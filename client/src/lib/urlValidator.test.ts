import { describe, it, expect } from 'vitest';
import { validateUrl } from './urlValidator';

describe('validateUrl client', () => {
  it('should return true for valid HTTP and HTTPS URLs', () => {
    expect(validateUrl('http://google.com')).toBe(true);
    expect(validateUrl('https://react.dev/reference/react')).toBe(true);
  });

  it('should return false for invalid URLs', () => {
    expect(validateUrl('invalid-url')).toBe(false);
    expect(validateUrl('ftp://files.com')).toBe(false);
    expect(validateUrl('')).toBe(false);
  });
});
