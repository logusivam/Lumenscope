import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { HomePage } from './HomePage';
import axe from 'axe-core';

describe('HomePage', () => {
  it('renders H1 tagline and URL form', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Illuminate what your users can't see.")).toBeDefined();
    expect(screen.getByPlaceholderText('https://example.com')).toBeDefined();
  });

  it('passes accessibility audits', async () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const results = await axe.run(container);
    // Ignore page region rule for partial wrapper
    const violations = results.violations.filter(v => v.id !== 'region');
    expect(violations).toEqual([]);
  });
});
