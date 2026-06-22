export function sanitizeHtml(html: string): string {
  if (!html) return '';
  // Defense in depth client-side script tag removal
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}
