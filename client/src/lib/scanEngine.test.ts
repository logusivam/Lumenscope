import { describe, it, expect, vi } from 'vitest';
import { runScan } from './scanEngine';
import axe from 'axe-core';

vi.mock('axe-core', () => ({
  default: {
    source: 'window.axe = { run: () => Promise.resolve({ passes: [], violations: [], incomplete: [], inapplicable: [] }) };',
    run: vi.fn().mockResolvedValue({
      passes: [],
      violations: [],
      incomplete: [],
      inapplicable: []
    })
  }
}));

describe('scanEngine runner', () => {
  it('should create iframe and invoke axe run', async () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    
    const htmlContent = '<html><body><h1>Header</h1></body></html>';
    const scanPromise = runScan('http://localhost', htmlContent);

    const iframe = appendSpy.mock.results[0].value as HTMLIFrameElement;
    expect(iframe).toBeDefined();
    
    if (iframe.onload) {
      (iframe.onload as Function)();
    }

    const results = await scanPromise;
    expect(results.url).toBe('http://localhost');
    expect(results.violations).toBeDefined();
    
    appendSpy.mockRestore();
  });
});
