import React from 'react';
import { useNavigate } from 'react-router';
import { URLInputForm } from '../../components/home/URLInputForm';
import { ScanProgressOverlay } from '../../components/results/ScanProgressOverlay';
import { useScan } from '../../hooks/useScan';
import { ArrowRight, Eye, ShieldAlert, Zap, HelpCircle, CheckCircle2, ListChecks, HeartHandshake, BookOpen, Download } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { scan, status, error } = useScan('http://localhost:3001');

  const handleAuditSubmit = async (url: string) => {
    try {
      const { results, html } = await scan(url);
      navigate('/results', { state: { results, html } });
    } catch (err) {
      // Error is captured in useScan state and rendered below the form
    }
  };

  return (
    <div className="bg-paper flex flex-col min-h-screen">
      {status === 'scanning' && <ScanProgressOverlay url={""} />}

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto w-full px-6 py-20 text-center flex flex-col items-center">
        <h1 className="font-sans text-4xl sm:text-5xl font-bold text-ink leading-tight mb-4">
          Illuminate what your users can't see.
        </h1>
        <p className="font-sans text-lg text-minor-grey mb-8 max-w-2xl">
          Lumenscope is a free web accessibility audit tool to identify barriers and test WCAG compliance. Paste any website URL below to run a free web accessibility scan in seconds, powered by industry-standard axe-core audit rules.
        </p>
        <URLInputForm onSubmit={handleAuditSubmit} isLoading={status === 'scanning'} />

        {error && (
          <div className="mt-6 p-4 bg-severity-critical/10 border border-severity-critical/20 rounded-md text-left max-w-2xl w-full">
            <p className="font-sans text-sm font-semibold text-severity-critical-text flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              Audit Failed
            </p>
            <p className="font-sans text-xs text-minor-grey mt-1">
              {error}
            </p>
          </div>
        )}
      </section>

      <hr className="border-t border-border-grey" />

      {/* What Problem Does This Page Solve? */}
      <section className="max-w-6xl mx-auto w-full px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-sans text-2xl font-bold text-ink mb-3">
            What Problem Does Lumenscope Solve?
          </h2>
          <p className="font-sans text-sm text-minor-grey leading-relaxed">
            The web is built for everyone, yet over 1 billion people experience accessibility barriers. Lumenscope translates dense, complex guidelines into simple, actionable visual instructions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-border-grey rounded-md p-6 flex gap-4">
            <div className="w-10 h-10 bg-severity-critical/10 text-severity-critical-text rounded-full flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans text-base font-bold text-ink mb-1">Curing "Web Exclusion"</h3>
              <p className="font-sans text-xs text-minor-grey leading-relaxed">
                Most websites suffer from missing image descriptions, confusing forms, and invisible color combinations, leaving millions of screen reader users and visually impaired people behind.
              </p>
            </div>
          </div>

          <div className="bg-white border border-border-grey rounded-md p-6 flex gap-4">
            <div className="w-10 h-10 bg-signal-blue/10 text-signal-blue rounded-full flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans text-base font-bold text-ink mb-1">Demystifying WCAG Compliance</h3>
              <p className="font-sans text-xs text-minor-grey leading-relaxed">
                Accessibility specs (WCAG 2.1/2.2) are notoriously dry, dense, and hard to interpret. We break down rules into clear, plain-English steps so you know exactly how to fix issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Lumenscope? */}
      <section className="max-w-6xl mx-auto w-full px-6 py-16 bg-white border-y border-border-grey/60">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-sans text-2xl font-bold text-ink mb-3">
            Why Choose Lumenscope?
          </h2>
          <p className="font-sans text-sm text-minor-grey leading-relaxed">
            While generic validators return cryptic logs, Lumenscope is built specifically to make accessibility diagnostic data visual, understandable, and actionable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 bg-signal-blue/10 rounded-full flex items-center justify-center text-signal-blue mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-sans text-base font-bold text-ink mb-2">Visual Audit Highlights</h3>
            <p className="font-sans text-xs text-minor-grey leading-relaxed">
              Don't guess where errors live. Our side-by-side preview panel highlights WCAG violations directly in the page DOM structure.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 bg-signal-blue/10 rounded-full flex items-center justify-center text-signal-blue mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-sans text-base font-bold text-ink mb-2">Plain English Explanations</h3>
            <p className="font-sans text-xs text-minor-grey leading-relaxed">
              We translate standard technical compliance IDs into clear descriptions and concrete code recommendations that any developer can implement.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 bg-signal-blue/10 rounded-full flex items-center justify-center text-signal-blue mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-sans text-base font-bold text-ink mb-2">Lumenscope Weighted Scoring</h3>
            <p className="font-sans text-xs text-minor-grey leading-relaxed">
              Our audit evaluation checks utilize a balanced weighting algorithm, providing you with a reliable industry-standard benchmark.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features & Capabilities */}
      <section className="max-w-6xl mx-auto w-full px-6 py-16">
        <h2 className="font-sans text-2xl font-bold text-ink text-center mb-12">
          Key Features & Capabilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-border-grey rounded-md p-6">
            <ListChecks className="w-8 h-8 text-signal-blue mb-3" />
            <h3 className="font-sans text-base font-bold text-ink mb-2">axe-Core Scan Engine</h3>
            <p className="font-sans text-xs text-minor-grey leading-relaxed">
              Scan any live webpage immediately against strict A, AA, and AAA conformance rules.
            </p>
          </div>

          <div className="bg-white border border-border-grey rounded-md p-6">
            <Eye className="w-8 h-8 text-signal-blue mb-3" />
            <h3 className="font-sans text-base font-bold text-ink mb-2">Live Visual Highlights</h3>
            <p className="font-sans text-xs text-minor-grey leading-relaxed">
              Overlay dotted borders and color highlights directly inside the live page preview.
            </p>
          </div>

          <div className="bg-white border border-border-grey rounded-md p-6">
            <Zap className="w-8 h-8 text-signal-blue mb-3" />
            <h3 className="font-sans text-base font-bold text-ink mb-2">Industry Standard Scoring</h3>
            <p className="font-sans text-xs text-minor-grey leading-relaxed">
              Weighted scoring system built directly upon global-standard accessibility audit weights.
            </p>
          </div>

          <div className="bg-white border border-border-grey rounded-md p-6">
            <CheckCircle2 className="w-8 h-8 text-signal-blue mb-3" />
            <h3 className="font-sans text-base font-bold text-ink mb-2">Passed Checks Registry</h3>
            <p className="font-sans text-xs text-minor-grey leading-relaxed">
              Explore audits that passed successfully with full element code-snippets.
            </p>
          </div>

          <div className="bg-white border border-border-grey rounded-md p-6">
            <Download className="w-8 h-8 text-signal-blue mb-3" />
            <h3 className="font-sans text-base font-bold text-ink mb-2">Multi-Format Reports</h3>
            <p className="font-sans text-xs text-minor-grey leading-relaxed">
              Download clean audits as print-ready PDF summaries, developer JSON files, or CSVs.
            </p>
          </div>

          <div className="bg-white border border-border-grey rounded-md p-6">
            <HeartHandshake className="w-8 h-8 text-signal-blue mb-3" />
            <h3 className="font-sans text-base font-bold text-ink mb-2">Interactive Color Contrast</h3>
            <p className="font-sans text-xs text-minor-grey leading-relaxed">
              Validate WCAG AAA color combinations in real-time using our dedicated tools.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-t border-border-grey" />

      {/* How it works */}
      <section className="max-w-6xl mx-auto w-full px-6 py-16">
        <h2 className="font-sans text-2xl font-bold text-ink text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-white border border-border-grey rounded-md">
            <div className="w-12 h-12 bg-signal-blue/10 rounded-full flex items-center justify-center text-signal-blue mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-sans text-lg font-semibold text-ink mb-2">1. Enter URL</h3>
            <p className="font-sans text-sm text-minor-grey leading-relaxed">
              Provide any public website address. Our backend proxy fetches the raw HTML securely.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white border border-border-grey rounded-md">
            <div className="w-12 h-12 bg-signal-blue/10 rounded-full flex items-center justify-center text-signal-blue mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-sans text-lg font-semibold text-ink mb-2">2. Scan DOM</h3>
            <p className="font-sans text-sm text-minor-grey leading-relaxed">
              We mount the page in a secure local frame and execute axe-core rules directly against the DOM.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white border border-border-grey rounded-md">
            <div className="w-12 h-12 bg-signal-blue/10 rounded-full flex items-center justify-center text-signal-blue mb-4">
              <ArrowRight className="w-6 h-6" />
            </div>
            <h3 className="font-sans text-lg font-semibold text-ink mb-2">3. Get Report</h3>
            <p className="font-sans text-sm text-minor-grey leading-relaxed">
              Review a prioritized breakdown of WCAG failures with clear, actionable plain-English remedies.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-t border-border-grey" />

      {/* Why it matters */}
      <section className="max-w-4xl mx-auto w-full px-6 py-16 text-center">
        <h2 className="font-sans text-2xl font-bold text-ink mb-6">
          Why Accessibility Matters
        </h2>
        <div className="bg-white border border-border-grey rounded-md p-8 text-left grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="font-mono text-5xl font-bold text-signal-blue">90%+</span>
            <p className="font-sans text-sm font-semibold text-ink mt-2">
              of homepages have detectable WCAG failures
            </p>
            <p className="font-sans text-xs text-minor-grey mt-1">
              According to the annual WebAIM Million analysis of top websites.
            </p>
          </div>
          <div className="border-l-0 md:border-l border-border-grey md:pl-8 flex flex-col gap-4">
            <p className="font-sans text-sm text-ink leading-relaxed">
              <strong>Legal Exposure:</strong> Regulatory frameworks like ADA, EN 301 549, and the RPwD Act mandate accessibility compliance.
            </p>
            <p className="font-sans text-sm text-ink leading-relaxed">
              <strong>Inclusive Design:</strong> Designing accessibly expands your audience reach and improves overall SEO ranking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
