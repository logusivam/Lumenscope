import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders application shell and homepage H1', () => {
    render(<App />);
    expect(screen.getByText("Illuminate what your users can't see.")).toBeDefined();
  });
});
