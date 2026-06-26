import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from './htmlSanitizer';

describe('htmlSanitizer client', () => {
  it('should remove script tags', () => {
    const input = '<div><script>alert(1)</script>Hello</div>';
    const expected = '<div>Hello</div>';
    expect(sanitizeHtml(input)).toBe(expected);
  });
});
