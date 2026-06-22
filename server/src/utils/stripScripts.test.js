import { describe, it, expect } from 'vitest';
import { stripScripts } from './stripScripts';

describe('stripScripts', () => {
  it('should remove script tags and content inside them', () => {
    const input = '<div>Hello</div><script>console.log("secret")</script><p>World</p>';
    const expected = '<div>Hello</div><p>World</p>';
    expect(stripScripts(input)).toBe(expected);
  });

  it('should handle scripts with attributes', () => {
    const input = '<div><script src="abc.js" async></script>Hello</div>';
    const expected = '<div>Hello</div>';
    expect(stripScripts(input)).toBe(expected);
  });

  it('should handle case insensitivity', () => {
    const input = '<SCRIPT>alert(1)</SCRIPT><div>Hello</div>';
    const expected = '<div>Hello</div>';
    expect(stripScripts(input)).toBe(expected);
  });
});
