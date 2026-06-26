import React from 'react';
import { Eye, Keyboard, HelpCircle, Laptop } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12">
      <h1 className="font-sans text-3xl font-bold text-ink mb-6">About Lumenscope</h1>

      <section className="mb-10 flex flex-col gap-4">
        <p className="font-sans text-sm text-ink leading-relaxed">
          Lumenscope is a diagnostic accessibility instrument designed to illuminate accessibility issues in web documents. By entering any public URL, our system fetches the HTML markup securely, parses it in a sandboxed environment, and executes industry-standard <strong>axe-core</strong> validation tests directly in your browser.
        </p>
        <p className="font-sans text-sm text-ink leading-relaxed">
          Unlike black-box checkers, Lumenscope offers a side-by-side visual highlight overlay and maps every violation directly to official WCAG success criteria guidelines with clear, human-readable suggestions.
        </p>

        <div className="bg-severity-serious/10 border border-severity-serious/20 rounded-md p-4 mt-2">
          <h2 className="font-sans text-sm font-semibold text-severity-serious-text mb-1">
            Important Limitations
          </h2>
          <ul className="list-disc pl-5 font-sans text-xs text-minor-grey flex flex-col gap-1.5">
            <li>
              <strong>Client-Rendered SPAs:</strong> Because the proxy server fetches server-rendered raw HTML, heavily dynamic single-page applications that construct their DOM exclusively client-side via JavaScript may return incomplete or near-empty scan results.
            </li>
            <li>
              <strong>Proxy-Blocked Sites:</strong> Websites protected by aggressive anti-bot features, CAPTCHAs, or Cloudflare verification block raw node fetch requests, preventing analysis.
            </li>
            <li>
              <strong>Same-Origin Content:</strong> Same-origin DOM access is required for in-browser axe evaluations. Staging raw HTML inside standard iframes without sandbox isolation makes DOM parsing possible but is limited to non-executing static content.
            </li>
          </ul>
        </div>
      </section>

      <hr className="border-border-grey mb-10" />

      {/* WCAG Primer */}
      <section className="mb-10">
        <h2 className="font-sans text-2xl font-bold text-ink mb-4">WCAG Guidelines Primer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-white border border-border-grey rounded-md">
            <h3 className="font-sans text-sm font-bold text-ink mb-2">Level A</h3>
            <p className="font-sans text-xs text-minor-grey leading-relaxed">
              The absolute minimum level of conformance. Covers critical accessibility barriers such as keyboard navigation traps and missing basic image alt attributes.
            </p>
          </div>
          <div className="p-4 bg-white border border-border-grey rounded-md">
            <h3 className="font-sans text-sm font-bold text-ink mb-2">Level AA</h3>
            <p className="font-sans text-xs text-minor-grey leading-relaxed">
              The global standard benchmark. Covers primary regulatory compliance (such as ADA and EN 301 549) with rules for color contrast minimums and text resizing.
            </p>
          </div>
          <div className="p-4 bg-white border border-border-grey rounded-md">
            <h3 className="font-sans text-sm font-bold text-ink mb-2">Level AAA</h3>
            <p className="font-sans text-xs text-minor-grey leading-relaxed">
              The highest tier of conformance. Reaching AAA requires specialized enhancements like high contrast ratios (7:1) and detailed error prevention.
            </p>
          </div>
        </div>

      <h3 className="font-sans text-lg font-bold text-ink mb-6">The POUR Principles of Accessibility</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Perceivable */}
        <div className="bg-white border border-border-grey rounded-md p-5 flex gap-4 transition-all hover:shadow-sm">
          <div className="w-10 h-10 bg-signal-blue/10 text-signal-blue rounded-full flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-sans text-sm font-bold text-ink mb-1">Perceivable</h4>
            <span className="font-mono text-[9px] uppercase font-bold text-minor-grey tracking-wider">"Can users see/hear the content?"</span>
            <p className="font-sans text-xs text-minor-grey leading-relaxed mt-2">
              Information cannot be invisible to all senses. This means providing text alternatives (alt text) for images, captions for video, and clear color contrast ratios.
            </p>
          </div>
        </div>

        {/* Operable */}
        <div className="bg-white border border-border-grey rounded-md p-5 flex gap-4 transition-all hover:shadow-sm">
          <div className="w-10 h-10 bg-signal-blue/10 text-signal-blue rounded-full flex items-center justify-center shrink-0">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-sans text-sm font-bold text-ink mb-1">Operable</h4>
            <span className="font-mono text-[9px] uppercase font-bold text-minor-grey tracking-wider">"Can they navigate and interact?"</span>
            <p className="font-sans text-xs text-minor-grey leading-relaxed mt-2">
              Users must be able to use the website's interface. The site must be fully keyboard navigable (no mouse required), free of keyboard traps, and provide clear focus styling.
            </p>
          </div>
        </div>

        {/* Understandable */}
        <div className="bg-white border border-border-grey rounded-md p-5 flex gap-4 transition-all hover:shadow-sm">
          <div className="w-10 h-10 bg-signal-blue/10 text-signal-blue rounded-full flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-sans text-sm font-bold text-ink mb-1">Understandable</h4>
            <span className="font-mono text-[9px] uppercase font-bold text-minor-grey tracking-wider">"Can they comprehend the interface?"</span>
            <p className="font-sans text-xs text-minor-grey leading-relaxed mt-2">
              Information and operations must be clear. This means using readable language properties, consistent navigation, and forms that provide helpful instructions and error corrections.
            </p>
          </div>
        </div>

        {/* Robust */}
        <div className="bg-white border border-border-grey rounded-md p-5 flex gap-4 transition-all hover:shadow-sm">
          <div className="w-10 h-10 bg-signal-blue/10 text-signal-blue rounded-full flex items-center justify-center shrink-0">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-sans text-sm font-bold text-ink mb-1">Robust</h4>
            <span className="font-mono text-[9px] uppercase font-bold text-minor-grey tracking-wider">"Does it work across standard devices?"</span>
            <p className="font-sans text-xs text-minor-grey leading-relaxed mt-2">
              Content must remain compatible with current and future browsers, assistive tools, and screen readers by using valid standard-compliant HTML tags.
            </p>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default AboutPage;
