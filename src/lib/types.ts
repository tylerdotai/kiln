// Shared TypeScript types for KILN

export interface Template {
  id: string;
  name: string;
  description: string;
  priceId: string;
  badge?: string;
  features: string[];
  color?: string;
  previewGradient: string;
}

export interface Deployment {
  id: string;
  templateName: string;
  subdomain: string;
  status: "pending" | "building" | "deployed" | "failed";
  deploymentUrl?: string;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}
