import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  name?: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  const firstName = name || "there";
  
  return (
    <Html>
      <Head />
      <Preview>Welcome to KILN. Your SaaS is almost live.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Welcome to KILN ⚡</Heading>
          
          <Text style={styles.text}>Hey {firstName},</Text>
          
          <Text style={styles.text}>
            Your SaaS is almost live. Here&apos;s your setup checklist to get started:
          </Text>
          
          <Section style={styles.checklist}>
            <Text style={styles.checkItem}>✅ Connect your domain</Text>
            <Text style={styles.checkItem}>✅ Set up your email provider (Resend)</Text>
            <Text style={styles.checkItem}>✅ Configure your payment processor (Polar)</Text>
            <Text style={styles.checkItem}>✅ Add your API keys</Text>
            <Text style={styles.checkItem}>✅ Customize your template</Text>
          </Section>
          
          <Button href="https://app.kiln.build/dashboard" style={styles.button}>
            Go to Dashboard
          </Button>
          
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Need help? Reply to this email or join our{' '}
              <Link href="https://discord.gg/kiln">Discord community</Link>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#fafafa",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "24px",
  },
  text: {
    fontSize: "16px",
    lineHeight: "24px",
    color: "#333",
    marginBottom: "16px",
  },
  checklist: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "24px",
    marginBottom: "24px",
    border: "1px solid #e5e5e5",
  },
  checkItem: {
    fontSize: "15px",
    lineHeight: "28px",
    color: "#333",
  },
  button: {
    backgroundColor: "#ff6b00",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    padding: "12px 24px",
    textDecoration: "none",
  },
  footer: {
    marginTop: "32px",
    paddingTop: "24px",
    borderTop: "1px solid #e5e5e5",
  },
  footerText: {
    fontSize: "14px",
    color: "#666",
  },
};
