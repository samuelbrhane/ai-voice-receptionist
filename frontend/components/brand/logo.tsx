export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="9" fill="var(--color-teal)" />
      <path d="M9 23 L14 9 L19 23 M11 18 H17" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 12.5 a5 5 0 0 1 0 7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M24.5 10 a8.5 8.5 0 0 1 0 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <LogoMark />
      <span className="font-display text-lg font-bold tracking-tight">Aurelia Dental</span>
    </span>
  );
}