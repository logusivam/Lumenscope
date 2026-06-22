import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PreviewPanel } from './PreviewPanel';

describe('PreviewPanel', () => {
  it('renders preview title and iframe container', () => {
    render(<PreviewPanel htmlContent="<div>Hello</div>" highlightSelectors={null} />);
    expect(screen.getByText('Page Preview')).toBeDefined();
    expect(screen.getByTitle('Scanned Website Preview')).toBeDefined();
  });
});
