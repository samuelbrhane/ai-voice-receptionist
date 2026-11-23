import type { Language } from "@/lib/api";

const OPTIONS: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "it", label: "Italiano" },
];

type Props = {
  value: Language;
  onChange: (language: Language) => void;
  disabled: boolean;
};

export function LanguageSwitch({ value, onChange, disabled }: Props) {
  return (
    <div role="radiogroup" aria-label="Call language" className="inline-flex rounded-full border border-line bg-surface p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          disabled={disabled}
          onClick={() => onChange(option.value)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition disabled:cursor-not-allowed ${
            value === option.value ? "bg-teal text-white" : "text-ink-soft hover:text-ink"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}