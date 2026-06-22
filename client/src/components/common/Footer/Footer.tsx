import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border-grey bg-paper px-6 py-6 text-center text-xs text-minor-grey no-print">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>Built by Dark · Lumenscope &copy; 2026</span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:text-signal-blue transition-colors focus:outline-none focus:underline"
        >
          GitHub &rarr;
        </a>
      </div>
    </footer>
  );
};
export default Footer;
