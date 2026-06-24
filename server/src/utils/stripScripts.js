export function stripScripts(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/on\w+\s*=\s*(['"])([\s\S]*?)\1/gi, '')
    .replace(/javascript\s*:\s*[\s\S]*?(?=['"])/gi, '');
}
