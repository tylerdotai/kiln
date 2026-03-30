export default function TermsPage() {
  return (
    <main className="min-h-screen pt-24 px-6">
      <div className="max-w-2xl mx-auto py-16">
        <h1 className="text-4xl font-bold text-[var(--color-text)] mb-8" style={{ fontFamily: "var(--font-display)" }}>
          Terms of Service
        </h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-[var(--color-text-secondary)]">
          <p>Last updated: March 2026</p>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing or using KILN, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mt-8 mb-4">2. Description of Service</h2>
          <p>KILN provides hosted AI agent infrastructure. We deploy and maintain OpenClaw agents on behalf of paying subscribers. Users retain ownership of their API keys and data.</p>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mt-8 mb-4">3. Account Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account and API keys. You agree to use the service lawfully and not to violate the rights of others.</p>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mt-8 mb-4">4. Payments</h2>
          <p>Subscriptions are billed monthly. You authorize us to charge your payment method on file. Cancellations take effect at the end of the billing period.</p>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mt-8 mb-4">5. Limitation of Liability</h2>
          <p>KILN is provided "as is." We make no warranties about uptime, availability, or fitness for a particular purpose. We are not liable for indirect or consequential damages.</p>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mt-8 mb-4">6. Contact</h2>
          <p>Questions? Message us at support@flumeusa.com.</p>
        </div>
      </div>
    </main>
  );
}
