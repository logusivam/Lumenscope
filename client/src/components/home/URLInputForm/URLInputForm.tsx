import React, { useState } from 'react';
import { validateUrl } from '../../../lib/urlValidator';

interface URLInputFormProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export const URLInputForm: React.FC<URLInputFormProps> = ({ onSubmit, isLoading = false }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please enter a URL to audit.');
      return;
    }

    if (!validateUrl(trimmedUrl)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    onSubmit(trimmedUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl" noValidate>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow relative">
          <label htmlFor="url-input" className="sr-only">
            Website URL to audit
          </label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
            }}
            placeholder="https://example.com"
            disabled={isLoading}
            className={`w-full px-4 py-3 bg-white border rounded-md text-ink placeholder-minor-grey focus:outline-none focus:ring-2 focus:ring-signal-blue transition-all ${
              error ? 'border-severity-critical focus:ring-severity-critical' : 'border-border-grey'
            }`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'url-error' : undefined}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-signal-blue hover:bg-opacity-90 active:bg-opacity-95 text-white font-semibold rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-signal-blue focus:ring-offset-2 disabled:bg-minor-grey disabled:cursor-not-allowed shrink-0"
        >
          {isLoading ? 'Scanning...' : 'Audit Now \u2192'}
        </button>
      </div>
      {error && (
        <p
          id="url-error"
          className="mt-2 text-sm font-semibold text-severity-critical-text"
          role="alert"
        >
          {error}
        </p>
      )}
    </form>
  );
};
export default URLInputForm;
