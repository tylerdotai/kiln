"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "connections">("profile");

  // Profile state
  const [name, setName] = useState("Tyler Delano");
  const [email, setEmail] = useState("tyler@flumeusa.com");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const TABS = [
    { id: "profile" as const, label: "Profile" },
    { id: "security" as const, label: "Security" },
    { id: "connections" as const, label: "Connections" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl font-bold text-text mb-1">
          Settings
        </h1>
        <p className="text-secondary">
          Manage your account, security, and connected services.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface border border-border rounded-xl p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-background text-text shadow-sm"
                : "text-secondary hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-surface border border-border rounded-2xl p-6 space-y-5"
        >
          <div className="flex items-center gap-4 pb-5 border-b border-border">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center text-2xl font-bold">
              T
            </div>
            <div>
              <button
                type="button"
                className="text-sm text-accent hover:underline font-medium"
              >
                Upload photo
              </button>
              <div className="text-xs text-secondary mt-0.5">
                JPG, PNG up to 2MB
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            {saved && (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </span>
            )}
          </div>
        </form>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-5">
          <form
            onSubmit={handleChangePassword}
            className="bg-surface border border-border rounded-2xl p-6 space-y-5"
          >
            <h3 className="font-semibold text-text">Change password</h3>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Current password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  New password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent transition-colors"
                  placeholder="Min. 8 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {passwordError && (
              <p className="text-sm text-red-600">{passwordError}</p>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-accent text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update password"}
              </button>
              {saved && (
                <span className="text-sm text-green-600 font-medium">Saved</span>
              )}
            </div>
          </form>

          {/* Sessions */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-text mb-4">Active sessions</h3>
            <div className="space-y-3">
              {[
                { device: "Mac Mini — Chrome", location: "Dallas, TX", current: true },
                { device: "iPhone — Safari", location: "Dallas, TX", current: false },
              ].map(({ device, location, current }) => (
                <div
                  key={device}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text">
                        {device}
                      </span>
                      {current && (
                        <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-secondary">{location}</span>
                  </div>
                  {!current && (
                    <button className="text-xs text-red-500 hover:underline">
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Connections Tab */}
      {activeTab === "connections" && (
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-text mb-4">
            Connected accounts
          </h3>

          {[
            {
              provider: "GitHub",
              icon: "🐙",
              desc: "Connected as tylerdotai",
              connected: true,
            },
            {
              provider: "Vercel",
              icon: "▲",
              desc: "Deployments linked",
              connected: true,
            },
            {
              provider: "Resend",
              icon: "📧",
              desc: "Not connected",
              connected: false,
            },
            {
              provider: "Polar",
              icon: "🛡️",
              desc: "Connected",
              connected: true,
            },
          ].map(({ provider, icon, desc, connected }) => (
            <div
              key={provider}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <div>
                  <div className="text-sm font-medium text-text">
                    {provider}
                  </div>
                  <div className="text-xs text-secondary">{desc}</div>
                </div>
              </div>
              <button
                className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-colors ${
                  connected
                    ? "border border-border text-secondary hover:text-red-500 hover:border-red-200"
                    : "bg-accent text-white hover:opacity-90"
                }`}
              >
                {connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
