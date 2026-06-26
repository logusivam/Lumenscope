import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { NotFoundPage } from './NotFoundPage';
import axe from 'axe-core';

describe('NotFoundPage', () => {
  it('renders 404 heading and return home link', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    expect(screen.getByText('404')).toBeDefined();
    expect(screen.getByText('Page Not Found')).toBeDefined();
    expect(screen.getByRole('link', { name: /return home/i })).toBeDefined();
  });

  it('passes accessibility audits', async () => {
    const { container } = render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    const results = await axe.run(container);
    const violations = results.violations.filter(v => v.id !== 'region');
    expect(violations).toEqual([]);
  });
});
