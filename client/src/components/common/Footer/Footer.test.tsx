import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import axe from 'axe-core';

describe('Footer Component', () => {
  it('renders copyright and redesign elements', () => {
    render(<Footer />);
    expect(screen.getByText(/Lumenscope/)).toBeDefined();
    expect(screen.getByText(/logusivam vision/i)).toBeDefined();
    expect(screen.getByText('Terms & Conditions')).toBeDefined();
    expect(screen.getByText('Privacy Policy')).toBeDefined();
    expect(screen.getByText('Contact')).toBeDefined();
  });

  it('passes accessibility audits', async () => {
    const { container } = render(<Footer />);
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
