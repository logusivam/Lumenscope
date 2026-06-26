import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';
import axe from 'axe-core';

describe('Logo Component', () => {
  it('renders full variant image', () => {
    render(<Logo variant="full" />);
    const img = screen.getByAltText('Lumenscope Logo');
    expect(img).toBeDefined();
  });

  it('renders icon only variant image', () => {
    render(<Logo variant="icon" />);
    const img = screen.getByAltText('Lumenscope Icon');
    expect(img).toBeDefined();
  });

  it('passes accessibility audits', async () => {
    const { container } = render(<Logo variant="full" />);
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
