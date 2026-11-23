import { Logo } from "@/components/brand";

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
      <Logo />
      <a
        href="https://github.com/samuelbrhane/ai-voice-receptionist"
        className="text-sm font-medium text-ink-soft hover:text-teal"
      >
        View the code
      </a>
    </header>
  );
}