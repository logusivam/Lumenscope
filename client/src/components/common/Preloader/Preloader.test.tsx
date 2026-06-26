import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Preloader } from './Preloader';

describe('Preloader Component', () => {
  it('renders preloader screen with logo and initialization text', () => {
    render(<Preloader />);
    expect(screen.getByAltText('Lumenscope Icon')).toBeDefined();
    expect(screen.getByText(/Initializing/i)).toBeDefined();
  });
});
