import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  it('renders search input and dropdown', async () => {
    const onSearchChange = vi.fn();
    const onSeverityFilterChange = vi.fn();

    render(
      <FilterBar
        searchTerm=""
        onSearchChange={onSearchChange}
        severityFilter="all"
        onSeverityFilterChange={onSeverityFilterChange}
      />
    );

    const input = screen.getByPlaceholderText(/search issues/i);
    await userEvent.type(input, 'color');
    expect(onSearchChange).toHaveBeenCalled();

    const select = screen.getByLabelText(/impact/i);
    await userEvent.selectOptions(select, 'critical');
    expect(onSeverityFilterChange).toHaveBeenCalledWith('critical');
  });
});
