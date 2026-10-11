import React from 'react';

interface UniqueLuxuryBagIconProps {
  className?: string;
  badgeCount?: number;
  showBadge?: boolean;
}

/**
 * Ultra-clean, simple and elegant line shopping bag icon.
 * Completely transparent background, sleek outline, no black boxes, no dark fills.
 */
export const UniqueLuxuryBagIcon: React.FC<UniqueLuxuryBagIconProps> = ({
  className = "w-5 h-5",
  badgeCount,
  showBadge = false,
}) => {
  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        strokeWidth="1.7"
        stroke="currentColor"
      >
        {/* Sleek Minimalist Handle */}
        <path
          d="M8.5 7.5V5.5C8.5 3.567 10.067 2 12 2C13.933 2 15.5 3.567 15.5 5.5V7.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Clean Outline Bag Body */}
        <path
          d="M5 7.5H19L17.75 21C17.65 21.55 17.18 22 16.62 22H7.38C6.82 22 6.35 21.55 6.25 21L5 7.5Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Floating Badge (optional if used standalone) */}
      {showBadge && typeof badgeCount === 'number' && badgeCount > 0 && (
        <span className="absolute -top-1.5 -right-2 bg-neutral-900 text-white font-mono text-[9px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
          {badgeCount}
        </span>
      )}
    </div>
  );
};
