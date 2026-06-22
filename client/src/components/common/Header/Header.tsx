import React from 'react';
import { NavLink } from 'react-router';
import { Logo } from '../Logo';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-border-grey bg-paper px-6 py-4 flex items-center justify-between no-print">
      <NavLink to="/" aria-label="Lumenscope Home">
        <Logo variant="full" />
      </NavLink>
      <nav className="flex items-center gap-6" aria-label="Primary Navigation">
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
    </header>
  );
};
export default Header;
