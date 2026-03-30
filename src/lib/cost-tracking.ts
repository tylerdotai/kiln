/**
 * Cost tracking and usage limits for KILN.
 * Stub implementation — wire to DB when ready.
 */

export const PLAN_LIMITS: Record<string, { deployments: number; emails: number; webhooks: number }> = {
  starter: { deployments: 1, emails: 100, webhooks: 1 },
  pro: { deployments: 5, emails: -1, webhooks: 10 },
  team: { deployments: -1, emails: -1, webhooks: -1 },
};

export async function checkUserLimits(userId: string) {
  return {
    allowed: true,
    current: { deployments: 0, emails: 0, webhooks: 0 },
    limit: { deployments: 5, emails: -1, webhooks: 10 },
  };
}

export async function recordDeployment(userId: string, templateId: string) {
  // Stub — implement with DB
}

export async function getTeamCostBreakdown() {
  // Stub — implement with DB
  return { resend: 0, polar: 0, trigger: 0, fly: 0, total: 0 };
}
