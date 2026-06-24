import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScan } from './useScan';
import * as scanEngine from '../lib/scanEngine';

describe('useScan hook', () => {
  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useScan());
    expect(result.current.status).toBe('idle');
    expect(result.current.results).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should handle successful scan', async () => {
    const mockResults = { url: 'http://test.com', timestamp: '', passes: [], violations: [], incomplete: [], inapplicable: [] };
    const scanSpy = vi.spyOn(scanEngine, 'scanUrl').mockResolvedValue({ results: mockResults, html: '<html></html>' });

    const { result } = renderHook(() => useScan());
    
    let scanPromise;
    act(() => {
      scanPromise = result.current.scan('http://test.com');
    });

    expect(result.current.status).toBe('scanning');

    await act(async () => {
      await scanPromise;
    });

    expect(result.current.status).toBe('success');
    expect(result.current.results).toEqual(mockResults);
    expect(result.current.error).toBeNull();

    scanSpy.mockRestore();
  });
});
