import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExportBar } from './ExportBar';

describe('ExportBar', () => {
  const mockResults = {
    url: 'http://test.com',
    timestamp: '',
    passes: [],
    violations: [],
    incomplete: [],
    inapplicable: []
  };

  it('renders all three export options', () => {
    render(<ExportBar results={mockResults} score={90} />);
    expect(screen.getByRole('button', { name: /export pdf/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /export json/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /copy summary/i })).toBeDefined();
  });
});
