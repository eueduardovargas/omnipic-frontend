'use client';

interface OmnipicLogoProps {
  className?: string;
}

export default function OmnipicLogo({ className = 'w-10 h-10' }: OmnipicLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="OmniPic logo"
    >
      <defs>
        <linearGradient id="omnipic-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="omnipic-inner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      {/* Rounded square background */}
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#omnipic-grad)" />
      {/* Inner glow */}
      <rect
        x="3"
        y="3"
        width="42"
        height="42"
        rx="11"
        fill="none"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="1"
      />
      {/* Camera aperture / O */}
      <circle cx="24" cy="24" r="11" fill="none" stroke="white" strokeWidth="2.5" strokeOpacity="0.95" />
      {/* Inner dot */}
      <circle cx="24" cy="24" r="4" fill="url(#omnipic-inner)" />
      {/* Sparkle */}
      <path
        d="M34 12 L35.5 15 L38.5 16.5 L35.5 18 L34 21 L32.5 18 L29.5 16.5 L32.5 15 Z"
        fill="white"
        fillOpacity="0.95"
      />
    </svg>
  );
}
