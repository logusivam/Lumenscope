import React from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

interface ScannedURLBarProps {
  url: string;
  timestamp: string;
  onRescan: () => void;
}

export const ScannedURLBar: React.FC<ScannedURLBarProps> = ({ url, timestamp, onRescan }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-border-grey px-6 py-4 flex flex-wrap items-center justify-between gap-4 no-print">
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-sans text-xs font-bold text-ink uppercase tracking-wider bg-paper px-2.5 py-1 rounded border border-border-grey">
          Scanned
        </span>
        <h1 className="font-mono text-sm font-semibold text-ink truncate max-w-md sm:max-w-xl" title={url}>
          {url}
        </h1>
        <span className="font-sans text-xs text-minor-grey hidden sm:inline">
          at {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onRescan}
          className="px-3.5 py-2 bg-white text-ink border border-border-grey rounded font-sans text-xs font-semibold hover:bg-paper/40 focus:outline-none focus:ring-2 focus:ring-signal-blue flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Re-scan
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-3.5 py-2 bg-signal-blue text-white rounded font-sans text-xs font-semibold hover:bg-opacity-90 active:bg-opacity-95 focus:outline-none focus:ring-2 focus:ring-signal-blue flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          New Scan
        </button>
      </div>
    </div>
  );
};
export default ScannedURLBar;
