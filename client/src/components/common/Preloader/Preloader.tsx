import React, { useState, useEffect } from 'react';
import logoIcon from '@/assets/lumenscope-icon.svg';

export const Preloader: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      const exitTimer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(exitTimer);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper transition-opacity duration-500 ease-in-out ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <style>{`
        @keyframes infinite-loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-infinite-loading {
          width: 100%;
          animation: infinite-loading 1.8s infinite ease-in-out;
        }
      `}</style>

      <div className="relative flex flex-col items-center gap-6 px-6 text-center max-w-sm">
        {/* Pulsing ring and rotating track around the logo icon */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Pulsing glowing background */}
          <div className="absolute inset-0 rounded-full bg-signal-blue/10 blur-xl animate-pulse" />
          
          {/* Spinning gradient ring */}
          <div className="absolute inset-0 rounded-full border-4 border-t-signal-blue border-r-transparent border-b-signal-blue/30 border-l-transparent animate-spin" style={{ animationDuration: '1.2s' }} />
          
          {/* Logo icon inside - pulsing smoothly instead of bouncing */}
          <img
            src={logoIcon}
            alt="Lumenscope Icon"
            className="w-14 h-14 object-contain relative z-10 animate-pulse"
            style={{ animationDuration: '2s' }}
          />
        </div>

        {/* Text and animated progress */}
        <div className="space-y-1">
          <p className="font-sans text-[10px] text-minor-grey tracking-widest uppercase font-semibold">
            Initializing Audit Dashboard
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-border-grey rounded-full overflow-hidden relative">
          <div className="h-full bg-signal-blue rounded-full absolute top-0 left-0 animate-infinite-loading" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
