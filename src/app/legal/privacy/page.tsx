export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 px-6">
      <div className="max-w-2xl mx-auto py-16">
        <h1 className="text-4xl font-bold text-[var(--color-text)] mb-8" style={{ fontFamily: "var(--font-display)" }}>
          Privacy Policy
        </h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-[var(--color-text-secondary)]">
          <p>Last updated: March 2026</p>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mt-8 mb-4">What We Collect</h2>
          <p>We collect your email address and payment information (processed by Polar.sh). We do not collect, store, or log your AI API keys or channel tokens — those remain private between you and your provider.</p>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mt-8 mb-4">How We Use It</h2>
          <p>Your email is used for account management and support. Payment data is handled by Polar.sh and not stored on our servers.</p>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mt-8 mb-4">Your Agent Data</h2>
          <p>Conversations with your AI agent are processed by your chosen LLM provider under their privacy policy. We do not store, review, or analyze the content of these conversations.</p>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mt-8 mb-4">Cookies</h2>
          <p>We use session cookies for authentication. No tracking or advertising cookies.</p>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mt-8 mb-4">Data Deletion</h2>
          <p>Delete your account at any time by contacting support@flumeusa.com. We delete your account data within 30 days.</p>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mt-8 mb-4">Contact</h2>
          <p>Questions? Email us at support@flumeusa.com.</p>
        </div>
      </div>
    </main>
  );
}
