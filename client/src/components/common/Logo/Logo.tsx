import React from 'react';
import logoFullPng from '@/assets/lumenscope-logo-full@2x.png';
import logoFullDarkPng from '@/assets/lumenscope-logo-full-dark@2x.png';
import logoIcon from '@/assets/lumenscope-icon.svg';

interface LogoProps {
  variant?: 'full' | 'icon';
  dark?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', dark = false, className = '' }) => {
  if (variant === 'icon') {
    return (
      <img
        src={logoIcon}
        alt="Lumenscope Icon"
        className={`h-10 w-auto inline-block align-middle ${className}`}
      />
    );
  }

  const logoSrc = dark ? logoFullDarkPng : logoFullPng;
  return (
    <img
      src={logoSrc}
      alt="Lumenscope Logo"
      className={`h-10 sm:h-12 w-auto inline-block align-middle object-contain ${className}`}
    />
  );
};

