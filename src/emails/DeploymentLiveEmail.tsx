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

interface DeploymentLiveEmailProps {
  url: string;
  templateName: string;
}

export function DeploymentLiveEmail({ url, templateName }: DeploymentLiveEmailProps) {
  const templateDisplayName = formatTemplateName(templateName);
  
  return (
    <Html>
      <Head />
      <Preview>Your {templateDisplayName} SaaS is live at {url}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>🚀 Your SaaS is Live!</Heading>
          
          <Text style={styles.text}>
            Your <strong>{templateDisplayName}</strong> template has been deployed 
            and is now live at:
          </Text>
          
          <Link href={url} style={styles.url}>
            {url}
          </Link>
          
          <Text style={styles.text}>
            Here&apos;s what to do next:
          </Text>
          
          <Section style={styles.checklist}>
            <Text style={styles.checkItem}>📋 Set up your environment variables</Text>
            <Text style={styles.checkItem}>🔑 Configure your API keys</Text>
            <Text style={styles.checkItem}>🎨 Customize your branding</Text>
            <Text style={styles.checkItem}>📧 Set up your email domain</Text>
            <Text style={styles.checkItem}>💳 Configure payment settings</Text>
          </Section>
          
          <Button href={url} style={styles.button}>
            View Your SaaS
          </Button>
          
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Need help? Check out our{' '}
              <Link href="https://docs.kiln.build">documentation</Link> or{' '}
              <Link href="https://app.kiln.build/support">contact support</Link>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function formatTemplateName(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
  url: {
    fontSize: "18px",
    color: "#ff6b00",
    fontWeight: "600",
    marginBottom: "24px",
    display: "inline-block",
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
