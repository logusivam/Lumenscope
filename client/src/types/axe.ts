export interface AxeNode {
  any: any[];
  all: any[];
  none: any[];
  impact: 'critical' | 'serious' | 'moderate' | 'minor' | null;
  html: string;
  target: string[];
  failureSummary?: string;
}

export interface AxeViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor' | null;
  tags: string[];
  description: string;
  help: string;
  helpUrl: string;
  nodes: AxeNode[];
}

export interface AxeResults {
  url: string;
  timestamp: string;
  passes: any[];
  violations: AxeViolation[];
  incomplete: any[];
  inapplicable: any[];
}
