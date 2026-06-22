import React from 'react';
import { useNavigate } from 'react-router';
import { URLInputForm } from '../../components/home/URLInputForm';
import { ScanProgressOverlay } from '../../components/results/ScanProgressOverlay';
import { useScan } from '../../hooks/useScan';
import { ArrowRight, Eye, ShieldAlert, Zap } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { scan, status, error } = useScan('http://localhost:3001');

  const handleAuditSubmit = async (url: string) => {
    try {
      const results = await scan(url);
      navigate('/results', { state: { results } });
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
          Paste any public URL. Get a prioritized plain-English accessibility report in seconds, powered by industry-standard axe-core.
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
