import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon';
  dark?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', dark = false, className = '' }) => {
  const inkColor = dark ? '#F7F7F5' : '#1A1D23';
  const signalBlueColor = dark ? '#5B7FFF' : '#2D5BFF';

  const logoSvg = (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block align-middle"
      aria-hidden="true"
    >
      {/* Handle */}
      <line
        x1="26"
        y1="26"
        x2="35"
        y2="35"
        stroke={inkColor}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Outer Lens Circle */}
      <circle
        cx="18"
        cy="18"
        r="11.25"
        stroke={signalBlueColor}
        strokeWidth="3.5"
      />
      {/* Eye Almond Outline */}
      <path
        d="M10.5 18C13 14.5 17 13.5 18 13.5C19 13.5 23 14.5 25.5 18C23 21.5 19 22.5 18 22.5C17 22.5 13 21.5 10.5 18Z"
        stroke={inkColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pupil Dot */}
      <circle cx="18" cy="18" r="2.25" fill={inkColor} />
      {/* Checkmark Badge */}
      <circle cx="28.5" cy="28.5" r="5.25" fill="#1F7A45" />
      <path
        d="M26.25 28.5L27.75 30L30.75 27"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (variant === 'icon') {
    return <span className={`inline-flex ${className}`}>{logoSvg}</span>;
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {logoSvg}
      <span className="font-sans text-xl tracking-tight leading-none">
        <span className="font-bold" style={{ color: inkColor }}>Lumen</span>
        <span className="font-semibold" style={{ color: signalBlueColor }}>scope</span>
      </span>
    </div>
  );
};
