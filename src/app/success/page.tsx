import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        {/* Check icon */}
        <div className="w-16 h-16 bg-[var(--color-success)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 16l7 7L26 9" stroke="#3D8B6E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1
          className="text-4xl font-black text-[var(--color-text)] mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Payment confirmed!
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg mb-8 leading-relaxed">
          Your KILN agent is being deployed. Head to the onboarding wizard to configure your channel and fire the kiln.
        </p>

        <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] mb-8 text-left">
          <h2 className="font-bold text-[var(--color-text)] mb-4">What happens next:</h2>
          <ol className="space-y-3">
            {[
              { n: "1", text: "Configure your channel (Discord, Telegram, or Slack)" },
              { n: "2", text: "Add your API keys — we verify them before deploying" },
              { n: "3", text: "Click Fire — your agent goes live on Fly.io" },
              { n: "4", text: "You'll get a live URL and setup wizard link in your email" },
            ].map((item) => (
              <li key={item.n} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                <span className="w-5 h-5 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.n}
                </span>
                {item.text}
              </li>
            ))}
          </ol>
        </div>

        <Link
          href="/onboarding"
          className="inline-block px-8 py-4 bg-[var(--color-accent)] text-white font-bold text-lg rounded-full hover:bg-[var(--color-accent-hover)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Set up your agent →
        </Link>
      </div>
    </main>
  );
}
