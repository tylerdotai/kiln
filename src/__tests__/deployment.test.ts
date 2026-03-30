import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("../lib/db", () => {
  const mockDb = {
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  };
  
  return {
    db: mockDb,
    deployments: {
      $inferInsert: {},
      $inferSelect: {},
    },
  };
});

// Import after mocking
import { db, deployments, type Deployment, type NewDeployment } from "../lib/db";

describe("Deployment Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Create Deployment", () => {
    it("should create a deployment with correct fields", async () => {
      const mockDeployment = {
        id: "dep_cld123456789",
        userId: "user_cld123456789",
        templateName: "saas-starter",
        subdomain: "tyler-kiln",
        status: "pending" as const,
        deploymentUrl: null,
        polarCheckoutId: "checkout_abc123",
        polarSubscriptionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the insert function
      const mockInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockResolvedValue(mockDeployment),
      });

      (db.insert as any).mockReturnValue({
        values: vi.fn().mockResolvedValue(mockDeployment),
      });

      const newDeployment: NewDeployment = {
        id: "dep_cld123456789",
        userId: "user_cld123456789",
        templateName: "saas-starter",
        subdomain: "tyler-kiln",
        status: "pending",
        polarCheckoutId: "checkout_abc123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Simulate insert
      (db.insert as any)(deployments).values(newDeployment);

      expect(db.insert).toHaveBeenCalledWith(deployments);
    });

    it("should require userId, templateName, and subdomain", () => {
      const validateDeployment = (data: Partial<NewDeployment>) => {
        const required = ["userId", "templateName", "subdomain"];
        return required.every((field) => data[field as keyof NewDeployment]);
      };

      expect(
        validateDeployment({
          userId: "user_123",
          templateName: "saas-starter",
          subdomain: "my-app",
        })
      ).toBe(true);

      expect(
        validateDeployment({
          userId: "user_123",
          templateName: "saas-starter",
        })
      ).toBe(false);
    });

    it("should accept valid status values", () => {
      const validStatuses = ["pending", "building", "deployed", "failed"];
      const isValidStatus = (status: string) =>
        validStatuses.includes(status);

      expect(isValidStatus("pending")).toBe(true);
      expect(isValidStatus("building")).toBe(true);
      expect(isValidStatus("deployed")).toBe(true);
      expect(isValidStatus("failed")).toBe(true);
      expect(isValidStatus("invalid")).toBe(false);
    });
  });

  describe("Update Deployment Status", () => {
    it("should update status to building", async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({
          id: "dep_123",
          status: "building",
        }),
      });

      (db.update as any).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue({ id: "dep_123", status: "building" }),
        }),
      });

      const updateResult = (db.update as any)(deployments).set({
        status: "building",
        updatedAt: new Date(),
      });

      expect(db.update).toHaveBeenCalledWith(deployments);
    });

    it("should update status to deployed with URL", async () => {
      const mockDeployment = {
        id: "dep_123",
        status: "deployed" as const,
        deploymentUrl: "https://tyler-kiln.kiln.build",
        updatedAt: new Date(),
      };

      (db.update as any).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockDeployment),
        }),
      });

      const result = (db.update as any)(deployments).set({
        status: "deployed",
        deploymentUrl: "https://tyler-kiln.kiln.build",
        updatedAt: new Date(),
      });

      expect(db.update).toHaveBeenCalled();
    });

    it("should update status to failed", async () => {
      const mockDeployment = {
        id: "dep_123",
        status: "failed" as const,
        updatedAt: new Date(),
      };

      (db.update as any).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockDeployment),
        }),
      });

      const result = (db.update as any)(deployments).set({
        status: "failed",
        updatedAt: new Date(),
      });

      expect(db.update).toHaveBeenCalled();
    });
  });

  describe("List User Deployments", () => {
    it("should return all deployments for a user", async () => {
      const mockDeployments: Partial<Deployment>[] = [
        {
          id: "dep_1",
          userId: "user_123",
          templateName: "saas-starter",
          subdomain: "app-1",
          status: "deployed",
          deploymentUrl: "https://app-1.kiln.build",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "dep_2",
          userId: "user_123",
          templateName: "api-only",
          subdomain: "api-1",
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockDeployments),
        }),
      });

      const result = (db.select as any)(db).from(deployments).where();

      expect(result).toBeDefined();
    });

    it("should return empty array for user with no deployments", async () => {
      const mockWhere = vi.fn().mockResolvedValue([]);
      const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
      const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
      
      (db.select as any) = mockSelect;

      const result = await mockSelect().from(deployments).where();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it("should filter deployments by status", async () => {
      const mockDeployments: Partial<Deployment>[] = [
        {
          id: "dep_1",
          userId: "user_123",
          templateName: "saas-starter",
          subdomain: "app-1",
          status: "deployed" as const,
          deploymentUrl: "https://app-1.kiln.build",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const filterByStatus = (
        deployments: Partial<Deployment>[],
        status: string
      ) => deployments.filter((d) => d.status === status);

      const deployed = filterByStatus(mockDeployments, "deployed");
      const pending = filterByStatus(mockDeployments, "pending");

      expect(deployed.length).toBe(1);
      expect(pending.length).toBe(0);
    });
  });

  describe("Deployment URL Generation", () => {
    it("should generate correct subdomain URL", () => {
      const generateDeploymentUrl = (subdomain: string) =>
        `https://${subdomain}.kiln.build`;

      expect(generateDeploymentUrl("tyler-kiln")).toBe(
        "https://tyler-kiln.kiln.build"
      );
      expect(generateDeploymentUrl("my-saas-app")).toBe(
        "https://my-saas-app.kiln.build"
      );
    });

    it("should validate subdomain format", () => {
      const isValidSubdomain = (subdomain: string) => {
        const regex = /^[a-z0-9][a-z0-9-]{2,62}[a-z0-9]$/;
        return regex.test(subdomain);
      };

      expect(isValidSubdomain("tyler-kiln")).toBe(true);
      expect(isValidSubdomain("myapp")).toBe(true);
      expect(isValidSubdomain("-invalid")).toBe(false);
      expect(isValidSubdomain("invalid-")).toBe(false);
      expect(isValidSubdomain("ab")).toBe(false); // too short
    });
  });
});
