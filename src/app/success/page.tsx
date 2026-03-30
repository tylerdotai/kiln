import Link from "next/link";

interface SuccessPageProps {
  searchParams: Promise<{ subdomain?: string; checkout_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const subdomain = params.subdomain || "your-app";
  const deploymentUrl = `https://${subdomain}.kiln.build`;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center animate-fade-in">
        {/* Green checkmark */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-green-50 border-4 border-green-200 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="font-serif text-5xl font-bold text-text mb-4">
          Your SaaS is live.
        </h1>

        <p className="text-secondary text-lg mb-2">
          Payment confirmed. Your deployment is being built.
        </p>

        <p className="text-secondary mb-10">
          Usually takes{" "}
          <span className="text-text font-medium">2–5 minutes</span>. You'll
          receive an email when it's ready.
        </p>

        {/* Deployment URL */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
          <p className="text-xs text-secondary uppercase tracking-wider mb-2">
            Your deployment
          </p>
          <a
            href={deploymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-accent text-lg hover:underline break-all"
          >
            {deploymentUrl}
          </a>
        </div>

        {/* Next steps */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-8 text-left">
          <h2 className="font-serif text-lg font-semibold text-text mb-4">
            What happens next
          </h2>
          <ol className="space-y-4">
            {[
              {
                step: 1,
                title: "We're building your SaaS",
                desc: "Your template is being customized with your API keys and subdomain.",
              },
              {
                step: 2,
                title: "Check your email",
                desc: "Credentials and setup guide will arrive in your inbox shortly.",
              },
              {
                step: 3,
                title: "Customize and launch",
                desc: "Connect your domain, add your branding, and go live.",
              },
            ].map(({ step, title, desc }) => (
              <li key={step} className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-accent/10 text-accent font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  {step}
                </div>
                <div>
                  <div className="font-medium text-text text-sm">{title}</div>
                  <div className="text-secondary text-sm">{desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 bg-accent text-white py-3 rounded-xl font-semibold text-base hover:opacity-90 transition-opacity"
          >
            Go to dashboard →
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
