import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutPage } from './AboutPage';
import axe from 'axe-core';

describe('AboutPage', () => {
  it('renders content sections', () => {
    render(<AboutPage />);
    expect(screen.getByText('About Lumenscope')).toBeDefined();
    expect(screen.getByText('WCAG Guidelines Primer')).toBeDefined();
    expect(screen.getByText('Level A')).toBeDefined();
  });

  it('passes accessibility audits', async () => {
    const { container } = render(<AboutPage />);
    const results = await axe.run(container);
    const violations = results.violations.filter(v => v.id !== 'region');
    expect(violations).toEqual([]);
  });
});
