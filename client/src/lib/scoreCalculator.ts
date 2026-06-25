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

/**
 * Calculate an accessibility score from 0–100 based on axe-core violations.
 * 
 * Uses a logarithmic decay formula so that:
 *  - 0 violations = 100
 *  - A handful of minor violations ≈ 85–95 (good site)
 *  - Moderate issues ≈ 50–80 (average site)
 *  - Many critical/serious violations ≈ 0–40 (bad site)
 * 
 * The raw linear deduction (weight × nodeCount per violation) is converted
 * via: score = 100 × e^(-deduction / SCALE_FACTOR)
 * 
 * This avoids the problem where the linear formula `100 - deduction` bottoms
 * out at 0 for any site with more than ~10 critical violation nodes.
 */
const SCALE_FACTOR = 80; // Controls how quickly score drops; higher = more lenient

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
    // Cap the nodeCount multiplier at 5 per violation rule to prevent repeating
    // template errors (e.g. 100 missing alt attributes) from driving the score to 0.
    const deduction = weight * Math.min(nodeCount, 5);

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

  // Exponential decay scoring — provides meaningful differentiation
  // Examples with SCALE_FACTOR = 80:
  //   deduction   0 → score 100
  //   deduction  10 → score  88
  //   deduction  30 → score  69
  //   deduction  60 → score  47
  //   deduction 100 → score  29
  //   deduction 200 → score   8
  //   deduction 400 → score   1
  const score = Math.round(100 * Math.exp(-overallDeduction / SCALE_FACTOR));
  
  const pour = {
    perceivable: Math.round(100 * Math.exp(-perceivableDeduction / SCALE_FACTOR)),
    operable: Math.round(100 * Math.exp(-operableDeduction / SCALE_FACTOR)),
    understandable: Math.round(100 * Math.exp(-understandableDeduction / SCALE_FACTOR)),
    robust: Math.round(100 * Math.exp(-robustDeduction / SCALE_FACTOR))
  };

  return {
    score,
    pour,
    wcag: wcagCounts
  };
}
export default calculateScore;
