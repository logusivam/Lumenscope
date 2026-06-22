import { AxeResults } from './axe';

export type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';

export interface ScanState {
  status: ScanStatus;
  results: AxeResults | null;
  error: string | null;
}
