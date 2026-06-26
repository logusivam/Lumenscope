import React from 'react';
import { Link } from 'react-router';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <span className="font-mono text-5xl font-bold text-signal-blue mb-4">404</span>
      <h1 className="font-sans text-3xl font-bold text-ink mb-2">Page Not Found</h1>
      <p className="font-sans text-minor-grey mb-8 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-signal-blue hover:bg-opacity-90 active:bg-opacity-95 text-white font-semibold rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-signal-blue focus:ring-offset-2"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
