import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ResultsPage } from './ResultsPage';

vi.mock('recharts', async (importOriginal) => {
  const original = await importOriginal<typeof import('recharts')>();
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div className="responsive-container-mock">{children}</div>
  };
});

describe('ResultsPage', () => {
  const mockResults = {
    url: 'http://test.com',
    timestamp: new Date().toISOString(),
    passes: [],
    violations: [],
    incomplete: [],
    inapplicable: []
  };

  it('renders results layout', () => {
    // Render with state set in MemoryRouter
    render(
      <MemoryRouter initialEntries={[{ pathname: '/results', state: { results: mockResults } }]}>
        <ResultsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('http://test.com')).toBeDefined();
    expect(screen.getByText('Accessibility Health')).toBeDefined();
    expect(screen.getByText('Violations')).toBeDefined();
  });
});
