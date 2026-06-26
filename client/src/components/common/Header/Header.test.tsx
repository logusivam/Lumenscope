import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Header } from './Header';
import axe from 'axe-core';

describe('Header Component', () => {
  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Home' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Contrast' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'About' })).toBeDefined();
  });

  it('passes accessibility audits', async () => {
    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
