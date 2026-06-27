import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { BACKEND_URL } from '../../../config';

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | 'contact' | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const yearText = currentYear > 2026 ? `2026 - ${currentYear}` : '2026';

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Strict validation
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setSubmitError('All fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      setSubmitError('Please enter a valid email address.');
      return;
    }

    if (contactMessage.length > 500) {
      setSubmitError('Message cannot exceed 500 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          message: contactMessage.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setIsSubmitted(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');

      setTimeout(() => {
        setIsSubmitted(false);
        setActiveModal(null);
      }, 3000);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-border-grey bg-paper px-6 py-6 text-xs text-minor-grey no-print">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left spacer to center copyright on desktop */}
        <div className="hidden md:block w-64"></div>

        {/* Center copyright */}
        <div className="text-center flex-grow">
          <span className="block font-sans font-medium text-ink text-sm">
            Lumenscope &copy; {yearText}
          </span>
          <span className="block font-sans text-[10px] uppercase tracking-widest text-minor-grey mt-0.5 font-bold">
            logusivam vision
          </span>
        </div>

        {/* Right side links */}
        <div className="flex items-center justify-center md:justify-end gap-2 min-[376px]:gap-3 w-full md:w-64 font-sans font-medium text-[10px] min-[376px]:text-xs whitespace-nowrap">
          <button
            onClick={() => setActiveModal('terms')}
            className="hover:text-signal-blue transition-colors focus:outline-none focus:underline"
          >
            <span className="hidden min-[376px]:inline">Terms & Conditions</span>
            <span className="inline min-[376px]:hidden">Terms</span>
          </button>
          <span>&middot;</span>
          <button
            onClick={() => setActiveModal('privacy')}
            className="hover:text-signal-blue transition-colors focus:outline-none focus:underline"
          >
            <span className="hidden min-[376px]:inline">Privacy Policy</span>
            <span className="inline min-[376px]:hidden">Privacy</span>
          </button>
          <span>&middot;</span>
          <button
            onClick={() => setActiveModal('contact')}
            className="hover:text-signal-blue transition-colors focus:outline-none focus:underline"
          >
            Contact
          </button>
        </div>
      </div>

      {/* Popover Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-xl border border-border-grey relative flex flex-col">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-minor-grey hover:text-ink text-xl font-semibold focus:outline-none"
              aria-label="Close modal"
            >
              &times;
            </button>

            {activeModal === 'terms' && (
              <div>
                <h3 className="font-sans text-lg font-bold text-ink mb-4">Terms & Conditions</h3>
                <div className="font-sans text-xs text-minor-grey leading-relaxed space-y-3">
                  <p>
                    Welcome to Lumenscope. By accessing or using our accessibility auditing services, you agree to comply with and be bound by these Terms and Conditions.
                  </p>
                  <p>
                    <strong>1. Use of Service:</strong> Lumenscope provides automated tools to analyze public website URLs for WCAG accessibility issues. You are solely responsible for ensuring you have permissions to analyze the URLs you submit.
                  </p>
                  <p>
                    <strong>2. Disclaimer:</strong> Automated accessibility tools cannot guarantee complete compliance with all legal requirements. The reports generated by Lumenscope are for informational and auditing assistance only and do not constitute legal advice.
                  </p>
                  <p>
                    <strong>3. Limitations of Liability:</strong> Under no circumstances shall Lumenscope or logusivam vision be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this service.
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div>
                <h3 className="font-sans text-lg font-bold text-ink mb-4">Privacy Policy</h3>
                <div className="font-sans text-xs text-minor-grey leading-relaxed space-y-3">
                  <p>
                    At Lumenscope, we take privacy and data integrity seriously.
                  </p>
                  <p>
                    <strong>Data Minimization:</strong> Lumenscope does not store or persist scanned URLs or site HTML contents. All website retrieval is done transiently via a proxy for real-time analysis.
                  </p>
                  <p>
                    <strong>Third-Party Libraries:</strong> We utilize industry-standard accessibility testing tools like axe-core. These operations run locally in your browser context.
                  </p>
                  <p>
                    <strong>Changes to This Policy:</strong> We reserve the right to modify this privacy policy at any time. Any changes will be reflected with an updated date in the system footer.
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'contact' && (
              <div>
                <h3 className="font-sans text-lg font-bold text-ink mb-2">Contact Us</h3>
                <p className="font-sans text-xs text-minor-grey mb-4 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-signal-blue" />
                  Email: <a href="mailto:devbridgeenquirz@gmail.com" className="text-signal-blue font-semibold hover:underline">devbridgeenquirz@gmail.com</a>
                </p>

                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle2 className="w-12 h-12 text-severity-pass mb-3" />
                    <h4 className="font-sans text-sm font-bold text-ink">Message Sent!</h4>
                    <p className="font-sans text-xs text-minor-grey mt-1">Thank you for reaching out. We will get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    {submitError && (
                      <div className="p-2.5 bg-severity-critical/10 border border-severity-critical/20 text-severity-critical-text rounded text-[11px] font-sans">
                        {submitError}
                      </div>
                    )}

                    <div>
                      <label htmlFor="contact-name" className="block font-sans text-xs font-semibold text-ink mb-1">
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-3 py-2 border border-border-grey rounded font-sans text-xs focus:ring-1 focus:ring-signal-blue focus:border-signal-blue outline-none text-ink bg-white disabled:opacity-50"
                        placeholder="Your Name"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block font-sans text-xs font-semibold text-ink mb-1">
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        disabled={isSubmitting}
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-border-grey rounded font-sans text-xs focus:ring-1 focus:ring-signal-blue focus:border-signal-blue outline-none text-ink bg-white disabled:opacity-50"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="contact-message" className="block font-sans text-xs font-semibold text-ink">
                          Message
                        </label>
                        <span className="font-sans text-[10px] text-minor-grey">
                          {500 - contactMessage.length} / 500
                        </span>
                      </div>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        maxLength={500}
                        disabled={isSubmitting}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full px-3 py-2 border border-border-grey rounded font-sans text-xs focus:ring-1 focus:ring-signal-blue focus:border-signal-blue outline-none text-ink bg-white resize-none disabled:opacity-50"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 bg-signal-blue text-white rounded font-sans text-xs font-semibold hover:bg-opacity-95 disabled:bg-opacity-50 flex items-center justify-center gap-1.5 transition-all shadow-sm disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
