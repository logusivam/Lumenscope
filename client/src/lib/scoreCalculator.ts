import { AxeViolation } from '../types/axe';
import { ScoreResult } from '../types/score';
import { getWcagLevel } from './wcagMapper';
import { getPourPrinciple } from './pourMapper';

const IMPACT_WEIGHTS: Record<string, number> = {
  critical: 10,
  serious: 5,
  moderate: 2,
  minor: 1
};

export function calculateScore(violations: AxeViolation[]): ScoreResult {
  let overallDeduction = 0;
  let perceivableDeduction = 0;
  let operableDeduction = 0;
  let understandableDeduction = 0;
  let robustDeduction = 0;

  const wcagCounts = {
    A: 0,
    AA: 0,
    AAA: 0
  };

  for (const violation of violations) {
    const impact = violation.impact || 'minor';
    const weight = IMPACT_WEIGHTS[impact] || 1;
    const nodeCount = violation.nodes ? violation.nodes.length : 0;
    const deduction = weight * nodeCount;

    overallDeduction += deduction;

    // Map to POUR
    const principle = getPourPrinciple(violation.tags);
    if (principle === 'perceivable') perceivableDeduction += deduction;
    else if (principle === 'operable') operableDeduction += deduction;
    else if (principle === 'understandable') understandableDeduction += deduction;
    else if (principle === 'robust') robustDeduction += deduction;

    // Map to WCAG Level
    const level = getWcagLevel(violation.tags);
    if (level === 'A') wcagCounts.A += nodeCount;
    else if (level === 'AA') wcagCounts.AA += nodeCount;
    else if (level === 'AAA') wcagCounts.AAA += nodeCount;
  }

  const score = Math.max(0, 100 - overallDeduction);
  
  const pour = {
    perceivable: Math.max(0, 100 - perceivableDeduction),
    operable: Math.max(0, 100 - operableDeduction),
    understandable: Math.max(0, 100 - understandableDeduction),
    robust: Math.max(0, 100 - robustDeduction)
  };

  return {
    score,
    pour,
    wcag: wcagCounts
  };
}
export default calculateScore;
