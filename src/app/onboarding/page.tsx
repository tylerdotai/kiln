"use client";

import { useState } from "react";
import Link from "next/link";

/* ─── Progress steps ─── */
const STEPS = [
  { id: 1, label: "Channel" },
  { id: 2, label: "API Keys" },
  { id: 3, label: "Deploy" },
  { id: 4, label: "Connect" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                s.id < current
                  ? "bg-[var(--color-success)] text-white"
                  : s.id === current
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
              }`}
            >
              {s.id < current ? "✓" : s.id}
            </div>
            <span className="text-xs text-[var(--color-text-secondary)] mt-1">{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-16 h-px mx-2 mb-5 ${s.id < current ? "bg-[var(--color-success)]" : "bg-[var(--color-border)]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Step 1: Choose channel ─── */
function StepChannel({ onNext }: { onNext: (channel: string) => void }) {
  const channels = [
    {
      id: "discord",
      name: "Discord",
      color: "#5865F2",
      icon: "💬",
      desc: "Full server access, thread-aware, slash commands",
      tokenLabel: "Discord Bot Token",
      tokenHint: "From discord.com/developers → your app → Bot → Reset Token",
      permNote: "You'll also need to invite the bot to your server",
    },
    {
      id: "telegram",
      name: "Telegram",
      color: "#26A5E4",
      icon: "✈️",
      desc: "Bot token, DM support, group access",
      tokenLabel: "Telegram Bot Token",
      tokenHint: "From @BotFather → /newbot → copy the token",
      permNote: "Your user ID (from @userinfobot) for allowlist",
    },
    {
      id: "slack",
      name: "Slack",
      color: "#4A154B",
      icon: "💼",
      desc: "Workspace app with full event API",
      tokenLabel: "Slack Bot Token",
      tokenHint: "From api.slack.com/apps → your app → OAuth → Bot User OAuth Token",
      permNote: "Requires Bot Token Scopes: chat:write, commands, app_mentions:read",
    },
  ];

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2 text-center" style={{ fontFamily: "var(--font-display)" }}>
        Choose your channel
      </h2>
      <p className="text-[var(--color-text-secondary)] text-center mb-8">
        Where do you want to talk to your agent?
      </p>
      <div className="grid gap-4 mb-8">
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setSelected(ch.id)}
            className={`p-5 rounded-xl border-2 text-left transition-all ${
              selected === ch.id
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{ch.icon}</span>
              <span className="font-bold text-[var(--color-text)]">{ch.name}</span>
              {selected === ch.id && (
                <span className="ml-auto text-[var(--color-accent)]">✓ Selected</span>
              )}
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">{ch.desc}</p>
          </button>
        ))}
      </div>
      {selected && (
        <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] mb-6">
          <p className="text-sm font-semibold text-[var(--color-text)] mb-1">
            What you need for {channels.find((c) => c.id === selected)?.name}:
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mb-1">
            → {channels.find((c) => c.id === selected)?.tokenLabel}
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            → {channels.find((c) => c.id === selected)?.permNote}
          </p>
        </div>
      )}
      <button
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="w-full py-3 rounded-full font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
      >
        Continue →
      </button>
    </div>
  );
}

/* ─── Step 2: API keys ─── */
function StepAPIKeys({
  channel,
  onNext,
}: {
  channel: string;
  onNext: (keys: Record<string, string>) => void;
}) {
  const [anthropicKey, setAnthropicKey] = useState("");
  const [channelToken, setChannelToken] = useState("");
  const [allowedIds, setAllowedIds] = useState("");
  const [showKeys, setShowKeys] = useState(false);

  const channelLabel =
    channel === "discord" ? "Discord Bot Token" :
    channel === "telegram" ? "Telegram Bot Token" :
    "Slack Bot Token";

  const channelHint =
    channel === "discord" ? "Bot token from discord.com/developers" :
    channel === "telegram" ? "From @BotFather" :
    "From api.slack.com/apps → OAuth";

  const allowedHint =
    channel === "telegram" ? "Your Telegram user ID (from @userinfobot)" :
    channel === "discord" ? "Your Discord user ID (enable Developer Mode → right-click → Copy ID)" :
    "Not required for Slack";

  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2 text-center" style={{ fontFamily: "var(--font-display)" }}>
        Add your API keys
      </h2>
      <p className="text-[var(--color-text-secondary)] text-center mb-8">
        Your keys are encrypted and only used for your agent.
      </p>

      <div className="space-y-5">
        {/* LLM Provider Key */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text)] mb-1">
            LLM API Key <span className="text-[var(--color-error)]">*</span>
          </label>
          <p className="text-xs text-[var(--color-text-secondary)] mb-2">
            OpenAI, Anthropic, Google Gemini, or MiniMax. Your agent uses this to think.
          </p>
          <div className="relative">
            <input
              type={showKeys ? "text" : "password"}
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm"
            />
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Supports: OpenAI, Anthropic, Google Gemini, MiniMax, OpenRouter
          </p>
        </div>

        {/* Channel token */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text)] mb-1">
            {channelLabel} <span className="text-[var(--color-error)]">*</span>
          </label>
          <p className="text-xs text-[var(--color-text-secondary)] mb-2">{channelHint}</p>
          <input
            type={showKeys ? "text" : "password"}
            value={channelToken}
            onChange={(e) => setChannelToken(e.target.value)}
            placeholder={
              channel === "discord" ? "Bot token like Mjxx..." :
              channel === "telegram" ? "Token from @BotFather" :
              "xoxb-..."
            }
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm"
          />
        </div>

        {/* Allowed IDs */}
        {(channel === "telegram" || channel === "discord") && (
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text)] mb-1">
              Your {channel === "telegram" ? "Telegram" : "Discord"} ID
            </label>
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">{allowedHint}</p>
            <input
              type="text"
              value={allowedIds}
              onChange={(e) => setAllowedIds(e.target.value)}
              placeholder={channel === "telegram" ? "123456789" : "Your Discord ID"}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm"
            />
          </div>
        )}

        {/* Show/hide toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowKeys(!showKeys)}
            className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
          >
            {showKeys ? "Hide keys" : "Show keys"}
          </button>
        </div>

        <button
          onClick={() =>
            onNext({
              anthropicKey,
              channelToken,
              allowedIds,
            })
          }
          disabled={!anthropicKey || !channelToken}
          className="w-full py-3 rounded-full font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
        >
          Fire the kiln →
        </button>
      </div>
    </div>
  );
}

/* ─── Step 3: Deploying ─── */
function StepDeploy({ agentUrl, channel, onComplete }: { agentUrl: string; channel: string; onComplete: () => void }) {
  const [fireLevel, setFireLevel] = useState(1);

  // Fire animation sequences through levels
  useState(() => {
    const t1 = setTimeout(() => setFireLevel(2), 2000);
    const t2 = setTimeout(() => setFireLevel(3), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  });

  const channelConnectHint =
    channel === "discord" ? "You'll invite the bot to your server next" :
    channel === "telegram" ? "Start a chat with your bot to verify it works" :
    "Your Slack app is ready to be added to your workspace";

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
        Firing the kiln...
      </h2>
      <p className="text-[var(--color-text-secondary)] mb-8">
        Spinning up your OpenClaw agent on Fly.io. This takes 2-3 minutes.
      </p>

      {/* Fire animation */}
      <div className="flex flex-col items-center justify-center py-8 mb-8">
        <div className="text-6xl mb-4">
          {fireLevel === 1 && "🪵"}
          {fireLevel === 2 && "🔥"}
          {fireLevel === 3 && "🔥"}
        </div>
        <div className="w-64 h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-warning)] transition-all duration-[2000ms]"
            style={{ width: `${Math.min(fireLevel * 33, 100)}%` }}
          />
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] mt-2">
          {fireLevel === 1 && "Creating your Fly.io app..."}
          {fireLevel === 2 && "Wiring your API keys..."}
          {fireLevel === 3 && "Almost ready..."}
        </p>
      </div>

      {/* Progress steps */}
      <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] text-left mb-6">
        {[
          { label: "Creating Fly.io app", done: true },
          { label: "Setting up persistent volume", done: true },
          { label: "Wiring your API keys", done: fireLevel >= 2 },
          { label: "Running health checks", done: fireLevel >= 3 },
          { label: "Starting your agent", done: !!agentUrl },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-3 py-1.5 text-sm">
            <span className={step.done ? "text-[var(--color-success)]" : "text-[var(--color-text-secondary)]"}>
              {step.done ? "✓" : "○"}
            </span>
            <span className={step.done ? "text-[var(--color-text)]" : "text-[var(--color-text-secondary)]"}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {agentUrl && (
        <div className="bg-[#1a3a2a] border border-[#3D8B6E]/30 rounded-xl p-4 mb-6">
          <p className="text-sm text-[#3D8B6E] font-semibold mb-1">✓ Agent deployed</p>
          <p className="text-xs text-[var(--color-text-secondary)] font-mono">{agentUrl}</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">{channelConnectHint}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Step 4: Connect ─── */
function StepConnect({ agentUrl, channel }: { agentUrl: string; channel: string }) {
  const steps =
    channel === "discord"
      ? [
          { n: "1", text: "Go to your agent's setup wizard:", link: `${agentUrl}/setup`, linkLabel: "Open setup wizard" },
          { n: "2", text: "In Discord Developer Portal → OAuth2 → add redirect URL:", link: `${agentUrl}/setup`, linkLabel: "Copy redirect URL" },
          { n: "3", text: "Generate an OAuth2 invite link for your bot", link: null, linkLabel: null },
          { n: "4", text: "Join your server and start chatting", link: null, linkLabel: null },
        ]
      : channel === "telegram"
      ? [
          { n: "1", text: "Go to your agent's setup wizard:", link: `${agentUrl}/setup`, linkLabel: "Open setup wizard" },
          { n: "2", text: "Start a DM with your bot on Telegram", link: null, linkLabel: null },
          { n: "3", text: "Verify your user ID is allowlisted", link: null, linkLabel: null },
        ]
      : [
          { n: "1", text: "Go to your agent's setup wizard:", link: `${agentUrl}/setup`, linkLabel: "Open setup wizard" },
          { n: "2", text: "In Slack API, set the Request URL to:", link: `${agentUrl}/setup`, linkLabel: "Copy webhook URL" },
          { n: "3", text: "Add the app to your Slack workspace", link: null, linkLabel: null },
        ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2 text-center" style={{ fontFamily: "var(--font-display)" }}>
        Connect your channel
      </h2>
      <p className="text-[var(--color-text-secondary)] text-center mb-8">
        Your agent is live. Now connect it to {channel}.
      </p>

      <div className="space-y-3 mb-8">
        {steps.map((step) => (
          <div key={step.n} className="flex items-start gap-3 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
            <div className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {step.n}
            </div>
            <div>
              <p className="text-sm text-[var(--color-text)]">{step.text}</p>
              {step.link && (
                <a
                  href={step.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--color-accent)] hover:underline mt-1 inline-block"
                >
                  {step.linkLabel} →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] mb-6">
        <p className="text-sm text-[var(--color-text-secondary)]">
          <span className="font-semibold text-[var(--color-text)]">Setup wizard:</span>{" "}
          <a href={`${agentUrl}/setup`} className="text-[var(--color-accent)]" target="_blank" rel="noopener noreferrer">
            {agentUrl}/setup
          </a>
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="flex-1 py-3 rounded-full font-semibold text-center bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
        >
          Go to dashboard
        </Link>
        <a
          href={`${agentUrl}/setup`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 rounded-full font-semibold text-center bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Open setup wizard
        </a>
      </div>
    </div>
  );
}

/* ─── Onboarding orchestrator ─── */
export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [channel, setChannel] = useState<string>("");
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [agentUrl, setAgentUrl] = useState<string>("");
  const [deploying, setDeploying] = useState(false);

  async function handleFire(keys: Record<string, string>) {
    setKeys(keys);
    setStep(3);
    setDeploying(true);

    // Call the deploy API
    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, ...keys }),
      });
      const data = await res.json();
      if (data.url) {
        setAgentUrl(data.url);
      }
    } catch (err) {
      console.error("Deploy failed:", err);
    } finally {
      setDeploying(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {/* Minimal nav */}
      <nav className="border-b border-[var(--color-border)] px-6 h-16 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>K</span>
          </div>
          <span className="font-bold text-[var(--color-text)]" style={{ fontFamily: "var(--font-display)" }}>KILN</span>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-lg mx-auto px-6 py-12">
        <StepIndicator current={step} />

        <div className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] p-8">
          {step === 1 && (
            <StepChannel onNext={(ch) => { setChannel(ch); setStep(2); }} />
          )}
          {step === 2 && (
            <StepAPIKeys channel={channel} onNext={handleFire} />
          )}
          {step === 3 && (
            <StepDeploy
              agentUrl={agentUrl}
              channel={channel}
              onComplete={() => setStep(4)}
            />
          )}
          {step === 4 && (
            <StepConnect agentUrl={agentUrl} channel={channel} />
          )}
        </div>
      </div>
    </main>
  );
}
