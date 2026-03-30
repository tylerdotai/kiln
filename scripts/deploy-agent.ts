/**
 * KILN Agent Deploy Script
 *
 * Takes a user config and deploys their OpenClaw agent to Fly.io.
 * Called from /api/deploy after the Fly app is created.
 *
 * Usage:
 *   npx tsx scripts/deploy-agent.ts \
 *     --app my-agent \
 *     --region iad \
 *     --channel discord \
 *     --api-key sk-ant-... \
 *     --discord-token Botxxx \
 *     --allowed-ids 123456
 *
 * Steps:
 * 1. Generate fly.toml from template with app name + region
 * 2. Copy OpenClaw config (with channel config applied)
 * 3. Create volume
 * 4. Set secrets
 * 5. Run fly deploy
 */

import { writeFileSync, cpSync, existsSync, mkdirSync, readFileSync } from "fs";
import { randomBytes } from "crypto";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = join(__dirname, "..", "template");
const DEPLOY_DIR = "/tmp/kiln-deploy"; // per-deploy working dir

interface AgentConfig {
  appName: string;
  region: string;
  channel: "discord" | "telegram" | "slack" | "web";
  apiKey: string;
  provider: "anthropic" | "openai" | "openrouter" | "minimax";
  channelToken?: string;
  allowedIds?: string;
}

function run(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" as const });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`));
    });
    child.on("error", reject);
  });
}

function generateFlyToml(appName: string, region: string, outPath: string) {
  const template = readFile(join(TEMPLATE_DIR, "fly.toml.example"));
  const config = template
    .replace(/\{\{APP_NAME\}\}/g, appName)
    .replace(/\{\{REGION\}\}/g, region);
  writeFileSync(outPath, config, "utf-8");
  console.log(`[deploy] Generated fly.toml: ${outPath}`);
}

function generateOpenClawConfig(cfg: AgentConfig, outPath: string) {
  const template = JSON.parse(
    readFile(join(TEMPLATE_DIR, "openclaw.json"), "utf-8")
  );

  // Enable only the selected channel
  template.channels = {
    discord: { enabled: cfg.channel === "discord" },
    telegram: { enabled: cfg.channel === "telegram" },
    slack: { enabled: cfg.channel === "slack" },
  };

  if (cfg.channel === "telegram" && cfg.channelToken) {
    template.channels.telegram.botToken = cfg.channelToken;
    if (cfg.allowedIds) {
      template.channels.telegram.allowFrom = cfg.allowedIds.split(",").map(Number);
    }
  }

  if (cfg.channel === "discord" && cfg.channelToken) {
    // Discord uses bot token via env var, handled in secrets
  }

  if (cfg.channel === "slack" && cfg.channelToken) {
    // Slack uses bot token via env var
  }

  // Set the LLM provider
  if (cfg.provider === "anthropic") {
    template.agents.defaults.model.primary = "anthropic/claude-opus-4-6";
    template.agents.defaults.model.fallbacks = [
      "openai/gpt-5.3-codex",
      "anthropic/claude-sonnet-4-5",
    ];
  } else if (cfg.provider === "openai") {
    template.agents.defaults.model.primary = "openai/gpt-5.3-codex";
  } else if (cfg.provider === "openrouter") {
    template.agents.defaults.model.primary = "openrouter/google/gemini-2.5-pro";
  }

  writeFileSync(outPath, JSON.stringify(template, null, 2), "utf-8");
  console.log(`[deploy] Generated openclaw.json for channel: ${cfg.channel}`);
}

function readFile(path: string): string {
  return existsSync(path) ? readFileSync(path, "utf-8") : "";
}

function fly(args: string[]): Promise<void> {
  return run("flyctl", args);
}

export async function deployAgent(cfg: AgentConfig): Promise<string> {
  const deployDir = `${DEPLOY_DIR}-${cfg.appName}`;
  mkdirSync(deployDir, { recursive: true });

  // 1. Copy template files
  const flyTomlDest = join(deployDir, "fly.toml");
  generateFlyToml(cfg.appName, cfg.region, flyTomlDest);

  const openclawJsonDest = join(deployDir, "openclaw.json");
  generateOpenClawConfig(cfg, openclawJsonDest);

  // 2. Copy Dockerfile
  cpSync(join(TEMPLATE_DIR, "Dockerfile"), join(deployDir, "Dockerfile"));

  // 3. Copy entrypoint
  cpSync(join(TEMPLATE_DIR, "entrypoint.sh"), join(deployDir, "entrypoint.sh"));

  // 4. Copy workspace + cron
  mkdirSync(join(deployDir, "config"), { recursive: true });
  cpSync(join(TEMPLATE_DIR, "workspace"), join(deployDir, "config", "workspace"), {
    recursive: true,
  });
  cpSync(join(TEMPLATE_DIR, "cron"), join(deployDir, "config", "cron"), {
    recursive: true,
  });

  // 5. Create volume
  try {
    await fly(["volumes", "create", "clawd_data", "--region", cfg.region, "--size", "10", "--app", cfg.appName, "-y"]);
  } catch {
    console.log("[deploy] Volume may already exist, continuing...");
  }

  // 6. Set secrets
  const secrets: Record<string, string> = {
    OPENCLAW_GATEWAY_TOKEN: randomHex(16),
    ANTHROPIC_API_KEY: cfg.apiKey,
  };

  if (cfg.channel === "discord" && cfg.channelToken) {
    secrets.DISCORD_BOT_TOKEN = cfg.channelToken;
    if (cfg.allowedIds) secrets.DISCORD_ALLOWED_IDS = cfg.allowedIds;
  }
  if (cfg.channel === "telegram" && cfg.channelToken) {
    secrets.TELEGRAM_BOT_TOKEN = cfg.channelToken;
    if (cfg.allowedIds) secrets.TELEGRAM_ALLOWED_IDS = cfg.allowedIds;
  }
  if (cfg.channel === "slack" && cfg.channelToken) {
    secrets.SLACK_BOT_TOKEN = cfg.channelToken;
  }

  for (const [key, value] of Object.entries(secrets)) {
    try {
      await fly([
        "secrets",
        "set",
        `${key}=${value}`,
        "--app",
        cfg.appName,
        "--stage",
      ]);
    } catch (e) {
      console.warn(`[deploy] Could not set secret ${key}:`, e);
    }
  }

  // 7. Run fly deploy
  process.chdir(deployDir);
  await fly(["deploy", "--config", "fly.toml", "--app", cfg.appName, "--remote-only"]);

  return `https://${cfg.appName}.fly.dev`;
}

function randomHex(bytes: number): string {
  return randomBytes(bytes).toString("hex");
}

// CLI entry point (guard removed — run directly with: npx tsx scripts/deploy-agent.ts)
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };

  const cfg: AgentConfig = {
    appName: get("--app") ?? "",
    region: get("--region") ?? "iad",
    channel: (get("--channel") as AgentConfig["channel"]) ?? "discord",
    apiKey: get("--api-key") ?? "",
    provider: (get("--provider") as AgentConfig["provider"]) ?? "anthropic",
    channelToken: get("--channel-token"),
    allowedIds: get("--allowed-ids"),
  };

  if (!cfg.appName || !cfg.apiKey) {
    console.error("Usage: tsx deploy-agent.ts --app <name> --api-key <key> [--channel discord] [--region iad]");
    process.exit(1);
  }

  deployAgent(cfg)
    .then((url) => {
      console.log(`[deploy] Agent live at: ${url}`);
    })
    .catch((err) => {
      console.error("[deploy] Failed:", err);
      process.exit(1);
    });
}
