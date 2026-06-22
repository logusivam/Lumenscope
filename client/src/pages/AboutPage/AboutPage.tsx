import React from 'react';

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

        <h3 className="font-sans text-lg font-semibold text-ink mb-4">The POUR Principles</h3>
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="font-sans text-sm font-semibold text-signal-blue">1. Perceivable</h4>
            <p className="font-sans text-xs text-minor-grey mt-0.5">
              Information and user interface components must be presentable to users in ways they can perceive (e.g. text alternatives for media, readable contrast).
            </p>
          </div>
          <div>
            <h4 className="font-sans text-sm font-semibold text-signal-blue">2. Operable</h4>
            <p className="font-sans text-xs text-minor-grey mt-0.5">
              User interface components and navigation must be operable (e.g. keyboard accessible, clear focus indicators, sufficient time to interact).
            </p>
          </div>
          <div>
            <h4 className="font-sans text-sm font-semibold text-signal-blue">3. Understandable</h4>
            <p className="font-sans text-xs text-minor-grey mt-0.5">
              Information and the operation of the user interface must be understandable (e.g. predictable navigation patterns, explicit input validation errors).
            </p>
          </div>
          <div>
            <h4 className="font-sans text-sm font-semibold text-signal-blue">4. Robust</h4>
            <p className="font-sans text-xs text-minor-grey mt-0.5">
              Content must be robust enough to be interpreted reliably by a wide variety of user agents, including assistive technologies like screen readers.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-border-grey mb-10" />

      {/* Tech Stack */}
      <section className="mb-8">
        <h2 className="font-sans text-2xl font-bold text-ink mb-4">Diagnostic Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {['React 18', 'TypeScript', 'Vite 8', 'Tailwind CSS v4', 'axe-core 4.11', 'Motion 12', 'Recharts 3', 'html2pdf.js', 'Express 4'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-white border border-border-grey rounded-full font-mono text-xs text-ink"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
