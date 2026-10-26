import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Node from '../components/Node';
import Base from '../components/Base';

describe('Node Component', () => {
  it('calls onInit when created', async () => {
    const config = new Base({
      onInit: vi.fn()
    });
    render(<Node config={ config } />);
    expect(config.onInit).toHaveBeenCalledTimes(1);
  });
});