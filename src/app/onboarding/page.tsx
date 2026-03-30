"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ─── Shared types ─── */
interface Keys {
  llmMode: "free" | "byok";
  llmProvider: string;
  llmKey: string;
  channelToken: string;
  allowedIds: string;
}

/* ─── Progress stepper ─── */
function Stepper({ current }: { current: number }) {
  const steps = ["Channel", "API Keys", "Deploy", "Connect"];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                i + 1 < current
                  ? "bg-[var(--color-success)] text-white"
                  : i + 1 === current
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
              }`}
            >
              {i + 1 < current ? "✓" : i + 1}
            </div>
            <span className="text-xs text-[var(--color-text-secondary)] mt-1">{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-10 h-px mx-2 mb-5 ${i + 1 < current ? "bg-[var(--color-success)]" : "bg-[var(--color-border)]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Step 1: Pick channel ─── */
function StepChannel({ onNext }: { onNext: (ch: string) => void }) {
  const channels = [
    { id: "discord", name: "Discord", color: "#5865F2", emoji: "💬", desc: "Full server access, thread-aware, slash commands" },
    { id: "telegram", name: "Telegram", color: "#26A5E4", emoji: "✈️", desc: "Bot DMs, group access, simple setup" },
    { id: "slack", name: "Slack", color: "#4A154B", emoji: "💼", desc: "Workspace app, full event API" },
  ];
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <h2 className="text-2xl font-black text-[var(--color-text)] mb-2 text-center" style={{ fontFamily: "var(--font-display)" }}>
        Choose your channel
      </h2>
      <p className="text-[var(--color-text-secondary)] text-center mb-8">
        Where do you want to talk to your agent?
      </p>
      <div className="space-y-3 mb-8">
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setSelected(ch.id)}
            className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
              selected === ch.id
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{ch.emoji}</span>
              <div className="flex-1">
                <span className="font-bold text-[var(--color-text)]">{ch.name}</span>
                <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{ch.desc}</p>
              </div>
              {selected === ch.id && <span className="text-[var(--color-accent)] font-bold">✓</span>}
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="w-full py-3 rounded-full font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Continue →
      </button>
    </div>
  );
}

/* ─── Step 2: API keys ─── */
const FREE_PROVIDERS = [
  { id: "groq", name: "Groq", emoji: "⚡", color: "#00d4aa", models: ["llama-3.3-70b-versatile", "mistral-saba-24b"], free: true },
  { id: "openrouter", name: "OpenRouter", emoji: "🌐", color: "#7c3aed", models: ["google/gemini-2.0-flash-thinking-exp-01-21", "anthropic/claude-3-haiku"], free: true },
  { id: "gemini", name: "Google Gemini", emoji: "✨", color: "#4285f4", models: ["gemini-2.0-flash", "gemini-1.5-flash"], free: true },
];
const BYOK_PROVIDERS = [
  { id: "openai", name: "OpenAI", emoji: "🤖", desc: "GPT-4o, o3. You pay OpenAI directly." },
  { id: "anthropic", name: "Anthropic", emoji: "🧠", desc: "Claude 3.5 Sonnet, Opus. You pay Anthropic directly." },
];

function StepAPIKeys({ channel, onNext }: { channel: string; onNext: (keys: Keys) => void }) {
  const [llmMode, setLlmMode] = useState<"free" | "byok">("free");
  const [freeProv, setFreeProv] = useState("groq");
  const [freeKey, setFreeKey] = useState("");
  const [byokProv, setByokProv] = useState("openai");
  const [byokKey, setByokKey] = useState("");
  const [chToken, setChToken] = useState("");
  const [allowedIds, setAllowedIds] = useState("");
  const [showKeys, setShowKeys] = useState(false);

  const chLabel = channel === "discord" ? "Discord Bot Token" : channel === "telegram" ? "Telegram Bot Token" : "Slack Bot Token";
  const chPlaceholder = channel === "discord" ? "Bot token (Mjxx...)" : channel === "telegram" ? "Token from @BotFather" : "xoxb-...";
  const chHint = channel === "discord" ? "From discord.com/developers → your app → Bot" : channel === "telegram" ? "From @BotFather → /newbot" : "From api.slack.com/apps → OAuth";
  const idHint = channel === "telegram" ? "From @userinfobot" : "Enable Developer Mode → right-click your name → Copy ID";
  const idPlaceholder = channel === "telegram" ? "123456789" : "Your Discord ID";

  const prov = llmMode === "free" ? FREE_PROVIDERS.find((p) => p.id === freeProv) : BYOK_PROVIDERS.find((p) => p.id === byokProv);
  const key = llmMode === "free" ? freeKey : byokKey;
  const setKey = llmMode === "free" ? setFreeKey : setByokKey;
  const needsKey = llmMode === "free" ? (FREE_PROVIDERS.find((p) => p.id === freeProv)?.free ? false : true) : true;

  const keyPlaceholder = llmMode === "free"
    ? freeProv === "groq" ? "gsk_..." : freeProv === "openrouter" ? "sk-or-..." : "AIza..."
    : byokProv === "openai" ? "sk-proj-..." : "sk-ant-api03-...";

  return (
    <div>
      <h2 className="text-2xl font-black text-[var(--color-text)] mb-2 text-center" style={{ fontFamily: "var(--font-display)" }}>
        Add your API keys
      </h2>
      <p className="text-[var(--color-text-secondary)] text-center mb-6">
        Your keys are encrypted. KILN never stores them in plain text.
      </p>

      {/* LLM mode toggle */}
      <div className="flex gap-2 p-1 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] mb-6">
        <button
          onClick={() => setLlmMode("free")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${llmMode === "free" ? "bg-[var(--color-accent)] text-white" : "text-[var(--color-text-secondary)]"}`}
        >
          ⚡ Free models
        </button>
        <button
          onClick={() => setLlmMode("byok")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${llmMode === "byok" ? "bg-[var(--color-accent)] text-white" : "text-[var(--color-text-secondary)]"}`}
        >
          🔑 Bring your own
        </button>
      </div>

      {/* Free providers */}
      {llmMode === "free" && (
        <div className="space-y-3 mb-6">
          {FREE_PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setFreeProv(p.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                freeProv === p.id ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5" : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{p.emoji}</span>
                <span className="font-bold text-[var(--color-text)]">{p.name}</span>
                {p.free && <span className="text-xs bg-[var(--color-success)]/10 text-[var(--color-success)] px-2 py-0.5 rounded-full font-semibold">Free</span>}
                {freeProv === p.id && <span className="ml-auto text-[var(--color-accent)]">✓</span>}
              </div>
              {freeProv === p.id && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.models.map((m) => (
                    <span key={m} className="text-xs bg-[var(--color-bg)] text-[var(--color-text-secondary)] px-2 py-0.5 rounded font-mono">{m}</span>
                  ))}
                </div>
              )}
            </button>
          ))}
          {!FREE_PROVIDERS.find((p) => p.id === freeProv)?.free && (
            <div>
              <p className="text-xs text-[var(--color-text-secondary)] mb-1">{prov?.name} API Key</p>
              <input
                type={showKeys ? "text" : "password"}
                value={freeKey}
                onChange={(e) => setFreeKey(e.target.value)}
                placeholder={keyPlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm"
              />
            </div>
          )}
          {FREE_PROVIDERS.find((p) => p.id === freeProv)?.free && (
            <div className="bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 rounded-xl p-3">
              <p className="text-sm text-[var(--color-success)] font-semibold">✓ No API key needed</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">{FREE_PROVIDERS.find((p) => p.id === freeProv)?.name} is free and unlimited.</p>
            </div>
          )}
        </div>
      )}

      {/* BYOK providers */}
      {llmMode === "byok" && (
        <div className="space-y-3 mb-6">
          {BYOK_PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setByokProv(p.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                byokProv === p.id ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5" : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{p.emoji}</span>
                <div>
                  <span className="font-bold text-[var(--color-text)]">{p.name}</span>
                  <p className="text-xs text-[var(--color-text-secondary)]">{p.desc}</p>
                </div>
                {byokProv === p.id && <span className="ml-auto text-[var(--color-accent)]">✓</span>}
              </div>
            </button>
          ))}
          <div>
            <p className="text-xs text-[var(--color-text-secondary)] mb-1">{prov?.name} API Key</p>
            <input
              type={showKeys ? "text" : "password"}
              value={byokKey}
              onChange={(e) => setByokKey(e.target.value)}
              placeholder={keyPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm"
            />
          </div>
        </div>
      )}

      {/* Channel token */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-[var(--color-text)] mb-1">{chLabel} <span className="text-[var(--color-error)]">*</span></p>
        <p className="text-xs text-[var(--color-text-secondary)] mb-2">{chHint}</p>
        <input
          type={showKeys ? "text" : "password"}
          value={chToken}
          onChange={(e) => setChToken(e.target.value)}
          placeholder={chPlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm"
        />
      </div>

      {/* Allowed IDs */}
      {(channel === "telegram" || channel === "discord") && (
        <div className="mb-6">
          <p className="text-xs text-[var(--color-text-secondary)] mb-1">Your {channel === "telegram" ? "Telegram" : "Discord"} ID — {idHint}</p>
          <input
            type="text"
            value={allowedIds}
            onChange={(e) => setAllowedIds(e.target.value)}
            placeholder={idPlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm"
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowKeys(!showKeys)}
        className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] mb-6"
      >
        {showKeys ? "Hide keys" : "Show keys"}
      </button>

      <button
        onClick={() => onNext({ llmMode, llmProvider: llmMode === "free" ? freeProv : byokProv, llmKey: key, channelToken: chToken, allowedIds })}
        disabled={(needsKey && !key) || !chToken}
        className="w-full py-3 rounded-full font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Fire the kiln →
      </button>
    </div>
  );
}

/* ─── Step 3: Deploying ─── */
function StepDeploy({ agentUrl, channel, onComplete }: { agentUrl: string; channel: string; onComplete: () => void }) {
  const [level, setLevel] = useState(1);
  useEffect(() => {
    const t1 = setTimeout(() => setLevel(2), 2500);
    const t2 = setTimeout(() => setLevel(3), 5000);
    const t3 = setTimeout(() => onComplete(), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-black text-[var(--color-text)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
        Firing the kiln...
      </h2>
      <p className="text-[var(--color-text-secondary)] mb-8">
        Spinning up your OpenClaw agent on Fly.io. 2-3 minutes.
      </p>
      <div className="text-5xl mb-6">{level === 1 ? "🪵" : level === 2 ? "🔥" : "🔥"}</div>
      <div className="w-64 mx-auto h-2 bg-[var(--color-surface)] rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-warning)] transition-all duration-[2000ms]"
          style={{ width: `${level * 33}%` }}
        />
      </div>
      <p className="text-xs text-[var(--color-text-secondary)] mb-8">
        {level === 1 ? "Creating your Fly.io app..." : level === 2 ? "Wiring your API keys..." : "Almost ready..."}
      </p>
      <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] text-left space-y-2">
        {[
          { label: "Creating Fly.io app", done: true },
          { label: "Setting up persistent volume", done: level >= 2 },
          { label: "Wiring your API keys", done: level >= 2 },
          { label: "Starting your agent", done: !!agentUrl },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className={s.done ? "text-[var(--color-success)]" : "text-[var(--color-text-secondary)]"}>{s.done ? "✓" : "○"}</span>
            <span className={s.done ? "text-[var(--color-text)]" : "text-[var(--color-text-secondary)]"}>{s.label}</span>
          </div>
        ))}
      </div>
      {agentUrl && (
        <div className="mt-4 bg-[#1a3a2a] border border-[#3D8B6E]/30 rounded-xl p-4">
          <p className="text-sm text-[#3D8B6E] font-semibold">✓ Agent deployed</p>
          <p className="text-xs font-mono text-[var(--color-text-secondary)] mt-1">{agentUrl}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Step 4: Connect ─── */
function StepConnect({ agentUrl, channel }: { agentUrl: string; channel: string }) {
  const steps = channel === "discord" ? [
    "Open your setup wizard",
    "Add your Discord redirect URL in discord.com/developers",
    "Generate an OAuth2 invite for your bot",
    "Join your server and start chatting",
  ] : channel === "telegram" ? [
    "Open your setup wizard",
    "Start a DM with your Telegram bot",
    "Verify your user ID is allowlisted",
  ] : [
    "Open your setup wizard",
    "Set the Slack Request URL in api.slack.com/apps",
    "Add the app to your workspace",
  ];

  return (
    <div>
      <h2 className="text-2xl font-black text-[var(--color-text)] mb-2 text-center" style={{ fontFamily: "var(--font-display)" }}>
        Connect your channel
      </h2>
      <p className="text-[var(--color-text-secondary)] text-center mb-8">
        Your agent is live. Now connect it to {channel}.
      </p>
      <div className="space-y-3 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-start gap-3 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
            <div className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
            <p className="text-sm text-[var(--color-text)]">{s}</p>
          </div>
        ))}
      </div>
      <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] mb-6">
        <p className="text-sm text-[var(--color-text-secondary)]">
          <span className="font-semibold text-[var(--color-text)]">Setup wizard: </span>
          <a href={`${agentUrl}/setup`} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">{agentUrl}/setup</a>
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/dashboard" className="flex-1 py-3 rounded-full font-semibold text-center border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors">
          Dashboard
        </Link>
        <a href={`${agentUrl}/setup`} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 rounded-full font-semibold text-center bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors">
          Open setup wizard →
        </a>
      </div>
    </div>
  );
}

/* ─── Page orchestrator ─── */
export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [channel, setChannel] = useState("");
  const [keys, setKeys] = useState<Keys | null>(null);
  const [agentUrl, setAgentUrl] = useState("");

  async function handleFire(k: Keys) {
    setKeys(k);
    setStep(3);
    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, ...k }),
      });
      const data = await res.json();
      if (data.url) setAgentUrl(data.url);
    } catch (err) {
      console.error("Deploy error:", err);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <nav className="border-b border-[var(--color-border)] px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>K</span>
          </div>
          <span className="font-bold text-[var(--color-text)]" style={{ fontFamily: "var(--font-display)" }}>KILN</span>
        </Link>
      </nav>
      <div className="max-w-lg mx-auto px-6 py-10">
        <Stepper current={step} />
        <div className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] p-8">
          {step === 1 && <StepChannel onNext={(ch) => { setChannel(ch); setStep(2); }} />}
          {step === 2 && <StepAPIKeys channel={channel} onNext={handleFire} />}
          {step === 3 && <StepDeploy agentUrl={agentUrl} channel={channel} onComplete={() => setStep(4)} />}
          {step === 4 && <StepConnect agentUrl={agentUrl} channel={channel} />}
        </div>
      </div>
    </main>
  );
}
