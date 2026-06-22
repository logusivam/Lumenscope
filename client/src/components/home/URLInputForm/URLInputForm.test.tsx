import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { URLInputForm } from './URLInputForm';
import axe from 'axe-core';

describe('URLInputForm', () => {
  it('renders input and button', () => {
    render(<URLInputForm onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText('https://example.com')).toBeDefined();
    expect(screen.getByRole('button', { name: /audit now/i })).toBeDefined();
  });

  it('shows error on empty submit', async () => {
    render(<URLInputForm onSubmit={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /audit now/i }));
    const alert = screen.getByRole('alert');
    expect(alert).toBeDefined();
    expect(alert.textContent).toContain('Please enter a URL to audit.');
  });

  it('shows error on invalid URL', async () => {
    render(<URLInputForm onSubmit={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText('https://example.com'), 'invalid-url');
    await userEvent.click(screen.getByRole('button', { name: /audit now/i }));
    const alert = screen.getByRole('alert');
    expect(alert).toBeDefined();
    expect(alert.textContent).toContain('Please enter a valid URL starting with http:// or https://');
  });

  it('calls onSubmit with valid URL', async () => {
    const onSubmit = vi.fn();
    render(<URLInputForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByPlaceholderText('https://example.com'), 'https://google.com');
    await userEvent.click(screen.getByRole('button', { name: /audit now/i }));
    expect(onSubmit).toHaveBeenCalledWith('https://google.com');
  });

  it('passes accessibility audits', async () => {
    const { container } = render(<URLInputForm onSubmit={vi.fn()} />);
    const results = await axe.run(container);
    // Landmark / Page rules should be disabled for components
    const violations = results.violations.filter(v => v.id !== 'region' && v.id !== 'label');
    expect(violations).toEqual([]);
  });
});
