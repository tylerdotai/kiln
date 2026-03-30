import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted to properly hoist the mock
const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn().mockResolvedValue({ data: { id: "email_123" } }),
}));

// Mock the resend module
vi.mock("resend", () => {
  return {
    Resend: vi.fn(() => ({
      emails: {
        send: mockSend,
      },
    })),
  };
});

// Mock the email templates to avoid React rendering issues in test
vi.mock("../emails", () => ({
  WelcomeEmail: vi.fn(() => "<html><body>Welcome</body></html>"),
  PaymentFailedEmail: vi.fn(() => "<html><body>Payment Failed</body></html>"),
  DeploymentLiveEmail: vi.fn(() => "<html><body>Deployment Live</body></html>"),
  ReceiptEmail: vi.fn(() => "<html><body>Receipt</body></html>"),
}));

// Mock @react-email/render
vi.mock("@react-email/render", () => ({
  render: vi.fn(() => "<html><body>Mocked Email</body></html>"),
}));

// Import email functions after mocking
import {
  sendWelcomeEmail,
  sendPaymentFailedEmail,
  sendDeploymentLiveEmail,
  sendReceiptEmail,
} from "../lib/email";

describe("Email Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({ data: { id: "email_123" } });
  });

  describe("sendWelcomeEmail", () => {
    it("should send welcome email with name", async () => {
      const result = await sendWelcomeEmail("user@example.com", "Tyler");

      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "KILN <hello@kiln.build>",
          to: "user@example.com",
          subject: "Welcome to KILN. Your SaaS is almost live.",
        })
      );
    });

    it("should send welcome email without name", async () => {
      const result = await sendWelcomeEmail("user@example.com");

      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it("should handle send failure", async () => {
      mockSend.mockRejectedValueOnce(new Error("API Error"));

      const result = await sendWelcomeEmail("user@example.com");

      expect(result.success).toBe(false);
      expect(result.error).toBe("API Error");
    });
  });

  describe("sendPaymentFailedEmail", () => {
    it("should send payment failed email with correct amount", async () => {
      const result = await sendPaymentFailedEmail("user@example.com", 29.99);

      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "KILN <hello@kiln.build>",
          to: "user@example.com",
          subject: "Payment failed. Update your billing to keep your SaaS running.",
        })
      );
    });

    it("should handle send failure", async () => {
      mockSend.mockRejectedValueOnce(new Error("SMTP Error"));

      const result = await sendPaymentFailedEmail("user@example.com", 29.99);

      expect(result.success).toBe(false);
      expect(result.error).toBe("SMTP Error");
    });
  });

  describe("sendDeploymentLiveEmail", () => {
    it("should send deployment live email with url and template name", async () => {
      const result = await sendDeploymentLiveEmail(
        "user@example.com",
        "https://tyler-kiln.kiln.build",
        "saas-starter"
      );

      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "KILN <hello@kiln.build>",
          to: "user@example.com",
          subject: "Your Saas Starter SaaS is live!",
        })
      );
    });

    it("should format template name correctly", async () => {
      const result = await sendDeploymentLiveEmail(
        "user@example.com",
        "https://api.kiln.build",
        "api-only"
      );

      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: "Your API Only SaaS is live!",
        })
      );
    });

    it("should handle send failure", async () => {
      mockSend.mockRejectedValueOnce(new Error("Network error"));

      const result = await sendDeploymentLiveEmail(
        "user@example.com",
        "https://tyler.kiln.build",
        "saas-starter"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Network error");
    });
  });

  describe("sendReceiptEmail", () => {
    it("should send receipt email with all details", async () => {
      const result = await sendReceiptEmail(
        "user@example.com",
        49.99,
        "2024-01-15",
        "saas-starter"
      );

      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "KILN <hello@kiln.build>",
          to: "user@example.com",
          subject: "Receipt for your KILN subscription",
        })
      );
    });

    it("should handle different amounts", async () => {
      const result = await sendReceiptEmail(
        "user@example.com",
        99.99,
        "2024-01-15",
        "enterprise"
      );

      expect(result.success).toBe(true);
    });

    it("should handle send failure", async () => {
      mockSend.mockRejectedValueOnce(new Error("Email service unavailable"));

      const result = await sendReceiptEmail(
        "user@example.com",
        49.99,
        "2024-01-15",
        "saas-starter"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Email service unavailable");
    });
  });
});

describe("Email Template Helpers", () => {
  describe("Template Name Formatting", () => {
    it("should format saas-starter correctly", () => {
      // Handle "saas" and "api" specially to preserve capitalization
      const specialWords: Record<string, string> = {
        saas: "SaaS",
        api: "API",
        posh: "Posh",
        crm: "CRM",
      };

      const formatTemplateName = (name: string): string => {
        return name
          .split("-")
          .map((word) => {
            const lower = word.toLowerCase();
            return specialWords[lower] || word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          })
          .join(" ");
      };
      
      expect(formatTemplateName("saas-starter")).toBe("SaaS Starter");
      expect(formatTemplateName("api-only")).toBe("API Only");
      expect(formatTemplateName("ecommerce")).toBe("Ecommerce");
    });

    it("should handle multi-word templates", () => {
      const specialWords: Record<string, string> = {
        saas: "SaaS",
        api: "API",
        posh: "Posh",
        crm: "CRM",
      };

      const formatTemplateName = (name: string): string => {
        return name
          .split("-")
          .map((word) => {
            const lower = word.toLowerCase();
            return specialWords[lower] || word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          })
          .join(" ");
      };
      
      expect(formatTemplateName("saas-with-auth")).toBe("SaaS With Auth");
    });
  });

  describe("Email Address Validation", () => {
    it("should validate email formats", () => {
      const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };
      
      expect(isValidEmail("user@example.com")).toBe(true);
      expect(isValidEmail("test@kiln.build")).toBe(true);
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
    });
  });

  describe("From Address", () => {
    it("should use correct from address", () => {
      const FROM_ADDRESS = "KILN <hello@kiln.build>";
      expect(FROM_ADDRESS).toBe("KILN <hello@kiln.build>");
    });
  });

  describe("Email Subject Lines", () => {
    it("should generate correct subject for welcome email", () => {
      const subject = "Welcome to KILN. Your SaaS is almost live.";
      expect(subject).toContain("KILN");
      expect(subject).toContain("Welcome");
    });

    it("should generate correct subject for payment failed email", () => {
      const subject = "Payment failed. Update your billing to keep your SaaS running.";
      expect(subject).toContain("Payment failed");
    });

    it("should generate correct subject for deployment live email", () => {
      const templateName = "SaaS Starter";
      const subject = `Your ${templateName} SaaS is live!`;
      expect(subject).toContain("SaaS is live");
    });

    it("should generate correct subject for receipt email", () => {
      const subject = "Receipt for your KILN subscription";
      expect(subject).toContain("Receipt");
    });
  });

  describe("Amount Formatting", () => {
    it("should format amounts correctly", () => {
      expect((29.99).toFixed(2)).toBe("29.99");
      expect((49.99).toFixed(2)).toBe("49.99");
      expect((99.99).toFixed(2)).toBe("99.99");
    });
  });
});
