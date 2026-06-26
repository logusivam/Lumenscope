import { describe, it, expect } from 'vitest';
import { validateUrl } from './validateUrl';

describe('validateUrl', () => {
  it('should return true for valid HTTP and HTTPS URLs', () => {
    expect(validateUrl('http://example.com')).toBe(true);
    expect(validateUrl('https://example.com/some/path?query=1')).toBe(true);
  });

  it('should return false for invalid URLs or unsupported protocols', () => {
    expect(validateUrl('ftp://example.com')).toBe(false);
    expect(validateUrl('not-a-url')).toBe(false);
    expect(validateUrl('')).toBe(false);
    expect(validateUrl(null)).toBe(false);
  });
});
