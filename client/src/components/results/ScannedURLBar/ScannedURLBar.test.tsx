import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ScannedURLBar } from './ScannedURLBar';

describe('ScannedURLBar', () => {
  it('renders elements and time string', () => {
    render(
      <MemoryRouter>
        <ScannedURLBar url="http://google.com" timestamp={new Date().toISOString()} onRescan={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText('http://google.com')).toBeDefined();
    expect(screen.getByRole('button', { name: /re-scan/i })).toBeDefined();
  });
});
