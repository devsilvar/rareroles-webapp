export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="8"
        fill="var(--color-surface-elevated)"
        stroke="var(--color-border-strong)"
      />
      <path
        d="M10 22V10h5.4c2.6 0 4.4 1.6 4.4 4 0 1.9-1.1 3.3-2.9 3.8L20 22h-2.5l-2.8-3.9H12.3V22H10zm2.3-5.9h3c1.3 0 2.2-.8 2.2-2.1s-.9-2-2.2-2h-3v4.1z"
        fill="currentColor"
      />
      <circle cx="24" cy="9" r="2.5" fill="var(--color-rare)" />
    </svg>
  );
}
