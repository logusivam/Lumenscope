import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ViolationPanel } from './ViolationPanel';

describe('ViolationPanel', () => {
  const mockViolations = [
    {
      id: 'image-alt',
      impact: 'critical' as const,
      tags: ['wcag2a', 'wcag111'],
      description: 'Ensure image tags have alt text',
      help: 'Alt text missing help text',
      helpUrl: 'http://example.com',
      nodes: []
    }
  ];

  it('renders violation panel listing elements', () => {
    render(
      <ViolationPanel
        violations={mockViolations}
        onHighlight={vi.fn()}
        selectedLevel="all"
      />
    );
    expect(screen.getByPlaceholderText(/search issues/i)).toBeDefined();
    expect(screen.getByText('image-alt')).toBeDefined();
  });
});
