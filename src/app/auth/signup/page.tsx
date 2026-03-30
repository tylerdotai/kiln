"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      // Auto sign-in after signup
      await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background flex">
      {/* Left — Brand panel */}
      <div className="hidden lg:flex flex-1 bg-dark items-center justify-center p-12">
        <div className="max-w-sm text-center">
          <div className="text-6xl mb-8">🔥</div>
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Fire your SaaS today.
          </h2>
          <p className="text-white/60 text-base">
            Join 100+ founders who've already deployed with KILN. Pick a
            template and ship in minutes.
          </p>

          <div className="mt-12 space-y-4 text-left">
            {[
              "6 production-ready templates",
              "Auth & billing wired up",
              "Deploy to edge in &lt; 5 min",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-white/80 text-sm">
                <svg
                  className="w-5 h-5 text-accent flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span dangerouslySetInnerHTML={{ __html: feature }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <span className="text-2xl">🔥</span>
            <span className="font-serif text-xl font-semibold text-text">
              KILN
            </span>
          </Link>

          <h1 className="font-serif text-4xl font-bold text-text mb-2">
            Create account.
          </h1>
          <p className="text-secondary mb-8">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text mb-2"
              >
                Name <span className="text-secondary">(optional)</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder:text-secondary/50 focus:outline-none focus:border-accent transition-colors"
                placeholder="Tyler Delano"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder:text-secondary/50 focus:outline-none focus:border-accent transition-colors"
                placeholder="tyler@flumeusa.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder:text-secondary/50 focus:outline-none focus:border-accent transition-colors"
                placeholder="Min. 8 characters"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white py-3 rounded-xl font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="text-xs text-secondary text-center">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-accent hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
