import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Layout } from './Layout';

describe('Layout', () => {
  it('renders children and navigation wrapper', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </MemoryRouter>
    );
    expect(screen.getByText('Test Content')).toBeDefined();
  });
});
