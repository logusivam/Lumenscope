import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Preloader } from './Preloader';

describe('Preloader Component', () => {
  it('renders preloader screen with app name', () => {
    render(<Preloader />);
    expect(screen.getByText('LUMENSCOPE')).toBeDefined();
    expect(screen.getByText(/Initializing/i)).toBeDefined();
  });
});
