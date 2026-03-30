import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center animate-fade-in">
        {/* Cancel icon */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-surface border-4 border-border flex items-center justify-center">
            <svg
              className="w-12 h-12 text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <h1 className="font-serif text-5xl font-bold text-text mb-4">
          Checkout cancelled.
        </h1>

        <p className="text-secondary text-lg mb-10">
          No worries — your payment wasn't processed. You can always come back
          and try again when you're ready.
        </p>

        <div className="bg-surface border border-border rounded-2xl p-6 mb-8 text-left">
          <h2 className="font-serif text-lg font-semibold text-text mb-4">
            Still need help?
          </h2>
          <ul className="space-y-3">
            {[
              { label: "Talk to us", desc: "Questions about pricing or templates?" },
              { label: "Browse templates", desc: "See all 6 templates before you decide." },
              { label: "Start free", desc: "Try the API-only template for $19/mo with a 14-day trial." },
            ].map(({ label, desc }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <span className="font-medium text-text text-sm">{label}</span>
                  <span className="text-secondary text-sm ml-1">— {desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/checkout"
            className="flex-1 bg-accent text-white py-3 rounded-xl font-semibold text-base hover:opacity-90 transition-opacity"
          >
            Try again →
          </Link>
          <Link
            href="/"
            className="flex-1 bg-surface border border-border text-text py-3 rounded-xl font-semibold text-base hover:bg-surface/80 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
