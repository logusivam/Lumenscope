import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import axe from 'axe-core';

describe('Footer Component', () => {
  it('renders copyright and github link', () => {
    render(<Footer />);
    expect(screen.getByText(/Built by Dark/)).toBeDefined();
    expect(screen.getByRole('link', { name: /github/i })).toBeDefined();
  });

  it('passes accessibility audits', async () => {
    const { container } = render(<Footer />);
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
