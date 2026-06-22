import { WCAG_MAP } from '../constants/wcag';

export function getWcagCriterion(tags: string[]): string {
  const wcagTag = tags.find(tag => tag.startsWith('wcag') && tag !== 'wcag2a' && tag !== 'wcag2aa' && tag !== 'wcag2aaa');
  if (wcagTag && WCAG_MAP[wcagTag]) {
    return WCAG_MAP[wcagTag];
  }
  return 'Unknown WCAG Criterion';
}

export function getWcagLevel(tags: string[]): 'A' | 'AA' | 'AAA' | 'Unknown' {
  if (tags.includes('wcag2a')) return 'A';
  if (tags.includes('wcag2aa')) return 'AA';
  if (tags.includes('wcag2aaa')) return 'AAA';

  const wcagTag = tags.find(tag => tag.startsWith('wcag'));
  if (wcagTag && WCAG_MAP[wcagTag]) {
    const matched = WCAG_MAP[wcagTag].match(/\((A|AA|AAA)\)$/);
    if (matched) {
      return matched[1] as 'A' | 'AA' | 'AAA';
    }
  }
  return 'Unknown';
}
