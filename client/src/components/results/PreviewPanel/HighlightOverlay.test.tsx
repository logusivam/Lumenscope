import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HighlightOverlay } from './HighlightOverlay';

describe('HighlightOverlay', () => {
  it('renders nothing when selectors are null', () => {
    const iframeRef = { current: null };
    const { container } = render(<HighlightOverlay iframeRef={iframeRef} selectors={null} />);
    expect(container.firstChild).toBeNull();
  });
});
