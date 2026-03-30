import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for KILN — how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div>
      <section
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '64px 24px 80px',
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <Link
            href="/"
            style={{
              fontSize: 14,
              color: 'var(--color-secondary)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            ← Back to home
          </Link>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Privacy Policy
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-secondary)', marginBottom: 48 }}>
          Last updated: March 2026
        </p>

        <div style={{ fontSize: 15, color: 'var(--color-secondary)', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 20 }}>
            Flume SaaS Factory ("we," "us," or "our") operates KILN (kiln.sh). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
          </p>

          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 36, marginBottom: 12 }}>
            1. Information We Collect
          </h2>
          <p style={{ marginBottom: 16 }}>
            <strong style={{ color: 'var(--color-text)' }}>Information you provide directly:</strong> When you sign up for KILN, you give us your name, email address, and payment information (processed securely by Polar, our payment provider). We do not store your raw payment credentials.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong style={{ color: 'var(--color-text)' }}>Information from your use of the service:</strong> We collect basic usage data — when you deploy, which template you used, error logs from failed deployments. This is anonymized and aggregate.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong style={{ color: 'var(--color-text)' }}>Information from integrations:</strong> KILN connects to services you own (Resend, Polar, Trigger.dev, PostHog). We store the API keys you provide solely to power those integrations. We do not read, store, or use the data flowing through those services.
          </p>

          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 36, marginBottom: 12 }}>
            2. How We Use Your Information
          </h2>
          <p style={{ marginBottom: 8 }}>We use your information to:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li>Provision and manage your KILN account</li>
            <li>Process payments via Polar</li>
            <li>Send transactional emails (onboarding, billing, support replies)</li>
            <li>Diagnose technical issues and improve service reliability</li>
            <li>Respond to your messages when you contact us</li>
          </ul>
          <p style={{ marginBottom: 16 }}>
            We do not sell, rent, or share your personal information with third parties for marketing purposes.
          </p>

          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 36, marginBottom: 12 }}>
            3. API Keys and Your Data
          </h2>
          <p style={{ marginBottom: 16 }}>
            When you connect external services to KILN (Resend, Polar, Trigger.dev, PostHog), you provide us with API keys. These keys are:
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li>Stored encrypted at rest</li>
            <li>Never shared with any third party</li>
            <li>Used only to power the specific integration you configured</li>
            <li>Deleted when you delete your KILN account</li>
          </ul>
          <p style={{ marginBottom: 16 }}>
            The data that flows through those services (your emails, payment records, job runs, analytics events) is governed by those services' own privacy policies. We do not access or use that data.
          </p>

          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 36, marginBottom: 12 }}>
            4. Cookies
          </h2>
          <p style={{ marginBottom: 16 }}>
            KILN uses minimal cookies — only what's needed for authentication (session management via Better Auth) and basic analytics (PostHog, which respects Do Not Track).
          </p>

          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 36, marginBottom: 12 }}>
            5. Data Retention
          </h2>
          <p style={{ marginBottom: 16 }}>
            We retain your account information for as long as your account is active. If you cancel, we retain your data for 30 days in case you want to reactivate, then delete it. You can request immediate deletion by contacting us.
          </p>

          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 36, marginBottom: 12 }}>
            6. Your Rights
          </h2>
          <p style={{ marginBottom: 16 }}>
            Depending on your location, you may have rights to access, correct, delete, or port your personal data. To exercise any of these rights, email us at <strong style={{ color: 'var(--color-text)' }}>hello@kiln.sh</strong>. We'll respond within 30 days.
          </p>

          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 36, marginBottom: 12 }}>
            7. Data Security
          </h2>
          <p style={{ marginBottom: 16 }}>
            We use industry-standard encryption (TLS 1.2+ in transit, AES-256 at rest), access controls, and regular security audits. No system is perfectly secure, but we take reasonable measures to protect your data.
          </p>

          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 36, marginBottom: 12 }}>
            8. Third-Party Services
          </h2>
          <p style={{ marginBottom: 16 }}>
            KILN uses third-party services to function. Their privacy policies apply to their handling of your data:
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li><strong style={{ color: 'var(--color-text)' }}>Polar</strong> — payment processing. <a href="https://polar.sh/privacy" style={{ color: 'var(--color-accent)' }}>Privacy Policy</a></li>
            <li><strong style={{ color: 'var(--color-text)' }}>Resend</strong> — email delivery. <a href="https://resend.com/privacy" style={{ color: 'var(--color-accent)' }}>Privacy Policy</a></li>
            <li><strong style={{ color: 'var(--color-text)' }}>Trigger.dev</strong> — job scheduling. <a href="https://trigger.dev/privacy" style={{ color: 'var(--color-accent)' }}>Privacy Policy</a></li>
            <li><strong style={{ color: 'var(--color-text)' }}>PostHog</strong> — analytics. <a href="https://posthog.com/privacy" style={{ color: 'var(--color-accent)' }}>Privacy Policy</a></li>
            <li><strong style={{ color: 'var(--color-text)' }}>Neon</strong> — database hosting. <a href="https://neon.tech/privacy" style={{ color: 'var(--color-accent)' }}>Privacy Policy</a></li>
          </ul>

          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 36, marginBottom: 12 }}>
            9. Children's Privacy
          </h2>
          <p style={{ marginBottom: 16 }}>
            KILN is not intended for use by anyone under the age of 18. We do not knowingly collect personal information from children.
          </p>

          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 36, marginBottom: 12 }}>
            10. Changes to This Policy
          </h2>
          <p style={{ marginBottom: 16 }}>
            If we change this Privacy Policy, we'll post the updated version here and update the "Last updated" date. For material changes, we'll notify you by email or through the app.
          </p>

          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 36, marginBottom: 12 }}>
            11. Contact
          </h2>
          <p style={{ marginBottom: 16 }}>
            Questions about this Privacy Policy? Email us at <strong style={{ color: 'var(--color-text)' }}>hello@kiln.sh</strong> or use the <Link href="/contact" style={{ color: 'var(--color-accent)' }}>contact form</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
