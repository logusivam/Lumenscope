export function stripScripts(html) {
  if (!html) return '';
  // Case-insensitive regex to remove script tags and everything inside them
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}
