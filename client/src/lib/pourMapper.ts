export type PourPrinciple = 'perceivable' | 'operable' | 'understandable' | 'robust';

export function getPourPrinciple(tags: string[]): PourPrinciple {
  // Check tags for categorizations
  for (const tag of tags) {
    if (
      tag.includes('color') ||
      tag.includes('text-alternatives') ||
      tag.includes('sensory') ||
      tag.includes('time-based-media') ||
      tag.includes('aria')
    ) {
      return 'perceivable';
    }
    if (
      tag.includes('keyboard') ||
      tag.includes('navigation') ||
      tag.includes('input') ||
      tag.includes('timing') ||
      tag.includes('scroll')
    ) {
      return 'operable';
    }
    if (
      tag.includes('language') ||
      tag.includes('predictability') ||
      tag.includes('help')
    ) {
      return 'understandable';
    }
    if (
      tag.includes('parsing') ||
      tag.includes('structure') ||
      tag.includes('name-role-value')
    ) {
      return 'robust';
    }
  }

  // Fallback map based on common rules or category prefixes
  return 'perceivable';
}
