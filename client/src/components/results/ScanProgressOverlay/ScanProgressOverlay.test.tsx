import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScanProgressOverlay } from './ScanProgressOverlay';

describe('ScanProgressOverlay', () => {
  it('renders progress text', () => {
    render(<ScanProgressOverlay url="http://google.com" />);
    expect(screen.getByText('Auditing Website')).toBeDefined();
    expect(screen.getByText('http://google.com')).toBeDefined();
  });
});
