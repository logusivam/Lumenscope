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

export function calculateScore(violations: AxeViolation[], passes: AxeViolation[] = []): ScoreResult {
  const wcagCounts = {
    A: 0,
    AA: 0,
    AAA: 0
  };

  // Populate WCAG node counts from violations
  for (const violation of violations) {
    const nodeCount = violation.nodes ? violation.nodes.length : 0;
    const level = getWcagLevel(violation.tags);
    if (level === 'A') wcagCounts.A += nodeCount;
    else if (level === 'AA') wcagCounts.AA += nodeCount;
    else if (level === 'AAA') wcagCounts.AAA += nodeCount;
  }

  if (passes.length === 0) {
    // Fallback to exponential decay formula when passes list is empty (e.g. in tests)
    let overallDeduction = 0;
    let perceivableDeduction = 0;
    let operableDeduction = 0;
    let understandableDeduction = 0;
    let robustDeduction = 0;

    for (const violation of violations) {
      const impact = violation.impact || 'minor';
      const weight = IMPACT_WEIGHTS[impact] || 1;
      const nodeCount = violation.nodes ? violation.nodes.length : 0;
      const deduction = weight * Math.min(nodeCount, 5);

      overallDeduction += deduction;

      const principle = getPourPrinciple(violation.tags);
      if (principle === 'perceivable') perceivableDeduction += deduction;
      else if (principle === 'operable') operableDeduction += deduction;
      else if (principle === 'understandable') understandableDeduction += deduction;
      else if (principle === 'robust') robustDeduction += deduction;
    }

    const score = Math.round(100 * Math.exp(-overallDeduction / SCALE_FACTOR));
    const pour = {
      perceivable: Math.round(100 * Math.exp(-perceivableDeduction / SCALE_FACTOR)),
      operable: Math.round(100 * Math.exp(-operableDeduction / SCALE_FACTOR)),
      understandable: Math.round(100 * Math.exp(-understandableDeduction / SCALE_FACTOR)),
      robust: Math.round(100 * Math.exp(-robustDeduction / SCALE_FACTOR))
    };

    return { score, pour, wcag: wcagCounts };
  }

  // Industry Standard Lighthouse-Style Weighted Rule Scoring
  let totalOverallWeight = 0;
  let passedOverallWeight = 0;

  const categories = {
    perceivable: { total: 0, passed: 0 },
    operable: { total: 0, passed: 0 },
    understandable: { total: 0, passed: 0 },
    robust: { total: 0, passed: 0 }
  };

  const processRule = (rule: AxeViolation, isPassed: boolean) => {
    const impact = rule.impact || 'moderate';
    const weight = IMPACT_WEIGHTS[impact] || 2;
    const principle = getPourPrinciple(rule.tags);

    // Update category weights
    categories[principle].total += weight;
    if (isPassed) {
      categories[principle].passed += weight;
    }

    // Update overall weights
    totalOverallWeight += weight;
    if (isPassed) {
      passedOverallWeight += weight;
    }
  };

  // Process all rules
  violations.forEach((rule) => processRule(rule, false));
  passes.forEach((rule) => processRule(rule, true));

  const score = totalOverallWeight > 0 
    ? Math.round((passedOverallWeight / totalOverallWeight) * 100) 
    : 100;

  const pour = {
    perceivable: categories.perceivable.total > 0 
      ? Math.round((categories.perceivable.passed / categories.perceivable.total) * 100) 
      : 100,
    operable: categories.operable.total > 0 
      ? Math.round((categories.operable.passed / categories.operable.total) * 100) 
      : 100,
    understandable: categories.understandable.total > 0 
      ? Math.round((categories.understandable.passed / categories.understandable.total) * 100) 
      : 100,
    robust: categories.robust.total > 0 
      ? Math.round((categories.robust.passed / categories.robust.total) * 100) 
      : 100
  };

  return {
    score,
    pour,
    wcag: wcagCounts
  };
}
export default calculateScore;
