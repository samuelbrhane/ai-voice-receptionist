export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-4 py-6 text-sm text-ink-soft sm:px-6">
        <p>Aurelia Dental is a fictional clinic made for this demo.</p>
        <p>
          Built by{" "}
          <a href="https://samuelbrhane.com" className="font-medium text-ink hover:text-teal">
            Samuel Brhane
          </a>
        </p>
      </div>
    </footer>
  );
}