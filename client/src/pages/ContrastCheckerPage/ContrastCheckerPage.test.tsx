import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContrastCheckerPage } from './ContrastCheckerPage';
import axe from 'axe-core';

describe('ContrastCheckerPage', () => {
  it('renders picker elements and updates values', async () => {
    render(<ContrastCheckerPage />);
    expect(screen.getByText('Contrast Checker')).toBeDefined();
    expect(screen.getByText('WCAG Compliance')).toBeDefined();

    const fgInput = screen.getByLabelText('Foreground Color (Text)');
    await userEvent.clear(fgInput);
    await userEvent.type(fgInput, '#000000');

    const bgInput = screen.getByLabelText('Background Color');
    await userEvent.clear(bgInput);
    await userEvent.type(bgInput, '#ffffff');

    expect(screen.getByText('21:1')).toBeDefined();
  });

  it('passes accessibility audits', async () => {
    const { container } = render(<ContrastCheckerPage />);
    const results = await axe.run(container);
    const violations = results.violations.filter(v => v.id !== 'region');
    expect(violations).toEqual([]);
  });
});
