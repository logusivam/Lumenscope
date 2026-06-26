import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { Logo } from '../Logo';
import { Menu, X, Home, Contrast, Info } from 'lucide-react';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-border-grey bg-paper px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between no-print relative z-30">
      <NavLink to="/" aria-label="Lumenscope Home" onClick={() => setIsOpen(false)}>
        <Logo variant="full" />
      </NavLink>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6" aria-label="Primary Navigation">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `font-sans text-sm font-medium transition-colors hover:text-signal-blue ${
              isActive ? 'text-signal-blue' : 'text-minor-grey'
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/contrast"
          className={({ isActive }) =>
            `font-sans text-sm font-medium transition-colors hover:text-signal-blue ${
              isActive ? 'text-signal-blue' : 'text-minor-grey'
            }`
          }
        >
          Contrast
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `font-sans text-sm font-medium transition-colors hover:text-signal-blue ${
              isActive ? 'text-signal-blue' : 'text-minor-grey'
            }`
          }
        >
          About
        </NavLink>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="block md:hidden p-1.5 text-ink hover:text-signal-blue transition-colors focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="absolute inset-x-0 top-full bg-paper border-b border-border-grey z-40 md:hidden shadow-lg animate-slide-down">
          <style>{`
            @keyframes slide-down {
              from { transform: translateY(-10px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            .animate-slide-down {
              animation: slide-down 0.2s ease-out forwards;
            }
          `}</style>
          <nav className="flex flex-col p-4 gap-1.5" aria-label="Mobile Navigation">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded font-sans text-sm font-semibold transition-all ${
                  isActive ? 'bg-signal-blue/10 text-signal-blue' : 'text-minor-grey hover:bg-paper/40 hover:text-ink'
                }`
              }
            >
              <Home className="w-4 h-4" />
              Home
            </NavLink>
            <NavLink
              to="/contrast"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded font-sans text-sm font-semibold transition-all ${
                  isActive ? 'bg-signal-blue/10 text-signal-blue' : 'text-minor-grey hover:bg-paper/40 hover:text-ink'
                }`
              }
            >
              <Contrast className="w-4 h-4" />
              Contrast
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded font-sans text-sm font-semibold transition-all ${
                  isActive ? 'bg-signal-blue/10 text-signal-blue' : 'text-minor-grey hover:bg-paper/40 hover:text-ink'
                }`
              }
            >
              <Info className="w-4 h-4" />
              About
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
