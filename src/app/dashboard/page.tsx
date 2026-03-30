import Link from "next/link";
import { getSession } from "@/lib/session";

// Mock deployments for demo
const DEMO_DEPLOYMENTS = [
  {
    id: "dep_1",
    templateName: "SaaS Starter",
    subdomain: "tyler-kiln",
    status: "deployed" as const,
    deploymentUrl: "https://tyler-kiln.kiln.build",
    createdAt: new Date("2026-03-25"),
  },
  {
    id: "dep_2",
    templateName: "API Only",
    subdomain: "api-tyler",
    status: "building" as const,
    deploymentUrl: undefined,
    createdAt: new Date("2026-03-28"),
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles = {
    deployed: "bg-green-50 text-green-700 border-green-200",
    building: "bg-amber-50 text-amber-700 border-amber-200",
    pending: "bg-blue-50 text-blue-700 border-blue-200",
    failed: "bg-red-50 text-red-700 border-red-200",
  };
  const labels = {
    deployed: "Deployed",
    building: "Building",
    pending: "Pending",
    failed: "Failed",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${styles[status as keyof typeof styles] || styles.pending
        }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${status === "deployed"
            ? "bg-green-500"
            : status === "building"
              ? "bg-amber-500 animate-pulse"
              : status === "pending"
                ? "bg-blue-500"
                : "bg-red-500"
          }`}
      />
      {labels[status as keyof typeof labels] || "Pending"}
    </span>
  );
}

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-text mb-1">
          Good {getTimeOfDay()}, {user?.name || "founder"}.
        </h1>
        <p className="text-secondary">
          Here's what's happening with your SaaS deployments.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active deployments", value: "2" },
          { label: "This month spend", value: "$29" },
          { label: "API calls", value: "12.4k" },
          { label: "Uptime", value: "99.9%" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-surface border border-border rounded-2xl p-5"
          >
            <div className="font-serif text-2xl font-bold text-text">
              {value}
            </div>
            <div className="text-sm text-secondary mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Deployments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-semibold text-text">
            Deployments
          </h2>
          <Link
            href="/checkout"
            className="text-sm text-accent hover:underline font-medium"
          >
            + New deployment
          </Link>
        </div>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          {DEMO_DEPLOYMENTS.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-semibold text-text mb-2">
                No deployments yet
              </h3>
              <p className="text-sm text-secondary mb-6">
                Fire up your first SaaS in under 5 minutes.
              </p>
              <Link
                href="/checkout"
                className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                🔥 Start building
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {DEMO_DEPLOYMENTS.map((dep) => (
                <div
                  key={dep.id}
                  className="px-6 py-5 flex items-center justify-between hover:bg-background/50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-lg flex-shrink-0">
                      🔥
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-text text-sm">
                          {dep.subdomain}.kiln.build
                        </span>
                        <StatusBadge status={dep.status} />
                      </div>
                      <div className="text-xs text-secondary">
                        {dep.templateName} · Created{" "}
                        {formatDate(dep.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {dep.deploymentUrl && (
                      <a
                        href={dep.deploymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent hover:underline font-medium"
                      >
                        Visit →
                      </a>
                    )}
                    <Link
                      href={`/dashboard/deployments/${dep.id}`}
                      className="text-sm text-secondary hover:text-text transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: "🚀",
            label: "Deploy new SaaS",
            desc: "Choose a template and go live in minutes",
            href: "/checkout",
          },
          {
            icon: "📊",
            label: "View analytics",
            desc: "Track usage, errors, and performance",
            href: "/dashboard",
          },
          {
            icon: "🔑",
            label: "Manage API keys",
            desc: "Update your Resend, Polar, and Trigger keys",
            href: "/dashboard/settings",
          },
        ].map(({ icon, label, desc, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-surface border border-border rounded-2xl p-5 hover:border-accent/30 hover:shadow-md transition-all group"
          >
            <div className="text-2xl mb-3">{icon}</div>
            <div className="font-medium text-text text-sm mb-1 group-hover:text-accent transition-colors">
              {label}
            </div>
            <div className="text-xs text-secondary">{desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
