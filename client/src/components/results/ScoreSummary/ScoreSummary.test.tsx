import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreSummary } from './ScoreSummary';
import axe from 'axe-core';

vi.mock('recharts', async (importOriginal) => {
  const original = await importOriginal<typeof import('recharts')>();
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div className="responsive-container-mock">{children}</div>
  };
});

describe('ScoreSummary', () => {
  const mockResult = {
    score: 85,
    pour: {
      perceivable: 90,
      operable: 80,
      understandable: 85,
      robust: 85
    },
    wcag: {
      A: 3,
      AA: 2,
      AAA: 1
    }
  };

  it('renders overall score and tabs', () => {
    render(
      <ScoreSummary
        scoreResult={mockResult}
        selectedLevel="all"
        onSelectLevel={vi.fn()}
      />
    );
    expect(screen.getByText('Accessibility Health')).toBeDefined();
    expect(screen.getByText('85')).toBeDefined();
    expect(screen.getByText('Level A')).toBeDefined();
  });

  it('passes accessibility audits', async () => {
    const { container } = render(
      <ScoreSummary
        scoreResult={mockResult}
        selectedLevel="all"
        onSelectLevel={vi.fn()}
      />
    );
    const results = await axe.run(container);
    const violations = results.violations.filter(v => v.id !== 'region');
    expect(violations).toEqual([]);
  });
});
