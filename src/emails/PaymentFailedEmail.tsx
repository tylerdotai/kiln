import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface PaymentFailedEmailProps {
  amount: number;
}

export function PaymentFailedEmail({ amount }: PaymentFailedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Payment failed. Update your billing to keep your SaaS running.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>⚠️ Payment Failed</Heading>
          
          <Text style={styles.text}>
            We couldn&apos;t process your payment of ${amount.toFixed(2)}.
          </Text>
          
          <Text style={styles.text}>
            Your SaaS will continue running for the next 7 days, but after that, 
            it will be paused until payment is received.
          </Text>
          
          <Text style={styles.text}>
            <strong>What to do:</strong>
          </Text>
          
          <Text style={styles.text}>
            1. Check your card details are up to date<br />
            2. Ensure you have sufficient funds<br />
            3. Update your billing information below
          </Text>
          
          <Button href="https://app.kiln.build/billing" style={styles.button}>
            Update Billing
          </Button>
          
          <Text style={styles.note}>
            If you believe this is an error, please contact support at{' '}
            <a href="mailto:support@kiln.build" style={styles.link}>
              support@kiln.build
            </a>
          </Text>
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
    color: "#dc2626",
    marginBottom: "24px",
  },
  text: {
    fontSize: "16px",
    lineHeight: "24px",
    color: "#333",
    marginBottom: "16px",
  },
  button: {
    backgroundColor: "#dc2626",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    padding: "12px 24px",
    textDecoration: "none",
    display: "inline-block",
  },
  note: {
    fontSize: "14px",
    color: "#666",
    marginTop: "24px",
  },
  link: {
    color: "#ff6b00",
    textDecoration: "underline",
  },
};
