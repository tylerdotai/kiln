import { Resend } from "resend";
import { render } from "@react-email/render";
import {
  WelcomeEmail,
  PaymentFailedEmail,
  DeploymentLiveEmail,
  ReceiptEmail,
} from "../emails";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY not set");
    _resend = new Resend(key);
  }
  return _resend;
}

const FROM_ADDRESS = "KILN <hello@kiln.build>";

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(to: string, name?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const html = await render(WelcomeEmail({ name }));
    
    await getResend().emails.send({
      from: FROM_ADDRESS,
      to,
      subject: "Welcome to KILN. Your SaaS is almost live.",
      html,
    });
    
    return { success: true };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send payment failed notification
 */
export async function sendPaymentFailedEmail(
  to: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const html = await render(PaymentFailedEmail({ amount }));
    
    await getResend().emails.send({
      from: FROM_ADDRESS,
      to,
      subject: "Payment failed. Update your billing to keep your SaaS running.",
      html,
    });
    
    return { success: true };
  } catch (error) {
    console.error("Failed to send payment failed email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send deployment live notification
 */
export async function sendDeploymentLiveEmail(
  to: string,
  url: string,
  templateName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const html = await render(DeploymentLiveEmail({ url, templateName }));
    
    await getResend().emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `Your ${formatTemplateName(templateName)} SaaS is live!`,
      html,
    });
    
    return { success: true };
  } catch (error) {
    console.error("Failed to send deployment live email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send receipt email for payment
 */
export async function sendReceiptEmail(
  to: string,
  amount: number,
  date: string,
  templateName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const html = await render(ReceiptEmail({ amount, date, templateName }));
    
    await getResend().emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `Receipt for your KILN subscription`,
      html,
    });
    
    return { success: true };
  } catch (error) {
    console.error("Failed to send receipt email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Format template name for display (e.g., "saas-starter" -> "SaaS Starter")
 */
function formatTemplateName(name: string): string {
  const specialWords: Record<string, string> = {
    saas: "SaaS",
    api: "API",
    posh: "Posh",
    crm: "CRM",
  };
  
  return name
    .split("-")
    .map((word) => {
      const lower = word.toLowerCase();
      return specialWords[lower] || word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}



/**
 * Generic email sender — used by webhook handlers for custom HTML.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await getResend().emails.send({ from: FROM_ADDRESS, to, subject, html });
    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
