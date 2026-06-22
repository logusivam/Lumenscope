import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';
import axe from 'axe-core';

describe('Logo Component', () => {
  it('renders full variant with text', () => {
    render(<Logo variant="full" />);
    expect(screen.getByText('Lumen')).toBeDefined();
    expect(screen.getByText('scope')).toBeDefined();
  });

  it('renders icon only variant', () => {
    render(<Logo variant="icon" />);
    expect(screen.queryByText('Lumen')).toBeNull();
  });

  it('passes accessibility audits', async () => {
    const { container } = render(<Logo variant="full" />);
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
