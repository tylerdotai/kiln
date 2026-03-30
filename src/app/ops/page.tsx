"use client";

export default function OpsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] p-8">
      <h1 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-[var(--color-text)] mb-8">
        Ops Dashboard
      </h1>
      <div className="grid grid-cols-3 gap-6">
        {["Revenue", "Active Subscriptions", "Churn Rate"].map((label) => (
          <div key={label} className="p-6 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">{label}</p>
            <p className="text-3xl font-bold text-[var(--color-text)]" style={{ fontFamily: "var(--font-display)" }}>—</p>
          </div>
        ))}
      </div>
    </main>
  );
}
