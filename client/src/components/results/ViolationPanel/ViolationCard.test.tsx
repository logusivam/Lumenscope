import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ViolationCard } from './ViolationCard';

describe('ViolationCard', () => {
  const mockViolation = {
    id: 'image-alt',
    impact: 'critical' as const,
    tags: ['wcag2a', 'wcag111'],
    description: 'Ensure image tags have alt text',
    help: 'Alt text missing help text',
    helpUrl: 'http://example.com',
    nodes: [
      { any: [], all: [], none: [], impact: 'critical' as const, html: '<img src="a.jpg">', target: ['img'] }
    ]
  };

  it('renders summary details and expands on click', async () => {
    render(<ViolationCard violation={mockViolation} onHighlight={vi.fn()} />);
    expect(screen.getByText('image-alt')).toBeDefined();
    expect(screen.getByText('critical')).toBeDefined();

    const trigger = screen.getByRole('button', { name: /critical image-alt/i });
    await userEvent.click(trigger);

    expect(screen.getByText('Alt text missing help text')).toBeDefined();
    expect(screen.getByText('<img src="a.jpg">')).toBeDefined();
  });
});
