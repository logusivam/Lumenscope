import { useState } from 'react';
import { ScanState } from '../types/scan';
import { scanUrl } from '../lib/scanEngine';

export function useScan(apiBaseUrl: string = 'http://localhost:3001') {
  const [state, setState] = useState<ScanState>({
    status: 'idle',
    results: null,
    error: null
  });

  const scan = async (url: string) => {
    setState({ status: 'scanning', results: null, error: null });
    try {
      const { results, html } = await scanUrl(url, apiBaseUrl);
      setState({ status: 'success', results, error: null });
      return { results, html };
    } catch (err: any) {
      const message = err.message || 'An error occurred during the scan';
      setState({ status: 'error', results: null, error: message });
      throw err;
    }
  };

  return {
    ...state,
    scan
  };
}
