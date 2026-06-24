/**
 * Aggressively strip scripts, noscript blocks, and inline event handlers
 * from HTML content to allow safe rendering in an iframe preview.
 * Also strips meta refresh redirects and content-security-policy meta tags
 * that could interfere with preview rendering.
 */
export function stripScripts(html) {
  if (!html) return '';
  return html
    // Remove all <script> tags and their content (including multiline)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    // Remove self-closing <script /> tags
    .replace(/<script\b[^>]*\/>/gi, '')
    // Remove <noscript> tags and their content
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '')
    // Remove inline event handlers (onclick, onload, onerror, etc.)
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    // Remove javascript: URIs in href/src/action attributes
    .replace(/(href|src|action)\s*=\s*(['"])javascript\s*:[^'"]*\2/gi, '$1=$2#$2')
    // Remove <meta http-equiv="refresh" ...> redirect tags
    .replace(/<meta\s+http-equiv\s*=\s*['"]refresh['"][^>]*>/gi, '')
    // Remove <meta http-equiv="Content-Security-Policy" ...> tags that block inline styles
    .replace(/<meta\s+http-equiv\s*=\s*['"]Content-Security-Policy['"][^>]*>/gi, '')
    // Remove nested iframes that might load external content and cause issues
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<iframe\b[^>]*\/>/gi, '');
}
