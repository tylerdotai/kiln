import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // cuid
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash").notNull(),
  polarCustomerId: text("polar_customer_id"),
  subscriptionStatus: text("subscription_status"),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),
  cancelAtPeriodEnd: integer("cancel_at_period_end", { mode: "boolean" }).default(false),
  tier: text("tier").default("starter"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Sessions table (from Better Auth)
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Deployments table
export const deployments = sqliteTable("deployments", {
  id: text("id").primaryKey(), // cuid
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  templateName: text("template_name").notNull(), // e.g. "saas-starter", "api-only"
  subdomain: text("subdomain").notNull(), // e.g. "tyler-kiln"
  flyAppId: text("fly_app_id"), // Fly.io app ID
  flyAppName: text("fly_app_name"), // Fly.io app name
  region: text("region").default("iad"), // Fly.io primary region
  status: text("status", {
    enum: ["pending", "provisioning", "building", "deployed", "failed"],
  })
    .notNull()
    .default("pending"),
  deploymentUrl: text("deployment_url"),
  polarCheckoutId: text("polar_checkout_id"),
  polarSubscriptionId: text("polar_subscription_id"),
  openAiKey: text("open_ai_key"), // encrypted customer OpenAI key
  databaseUrl: text("database_url"), // customer database URL override
  customerFlyToken: text("customer_fly_token"), // customer's own Fly.io token (self-serve)
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// API Keys table (customer-configured keys stored encrypted)
export const apiKeys = sqliteTable("api_keys", {
  id: text("id").primaryKey(), // cuid
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  deploymentId: text("deployment_id").references(() => deployments.id, {
    onDelete: "cascade",
  }),
  provider: text("provider", {
    enum: ["resend", "polar", "trigger", "posthog", "github"],
  }).notNull(),
  encryptedValue: text("encrypted_value").notNull(), // AES-256-GCM encrypted
  iv: text("iv").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  deployments: many(deployments),
  apiKeys: many(apiKeys),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const deploymentsRelations = relations(deployments, ({ one, many }) => ({
  user: one(users, {
    fields: [deployments.userId],
    references: [users.id],
  }),
  apiKeys: many(apiKeys),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
  deployment: one(deployments, {
    fields: [apiKeys.deploymentId],
    references: [deployments.id],
  }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Deployment = typeof deployments.$inferSelect;
export type NewDeployment = typeof deployments.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
