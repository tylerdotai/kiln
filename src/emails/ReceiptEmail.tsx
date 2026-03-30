import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ReceiptEmailProps {
  amount: number;
  date: string;
  templateName: string;
}

export function ReceiptEmail({ amount, date, templateName }: ReceiptEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Receipt for your KILN subscription</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>🧾 Payment Receipt</Heading>
          
          <Text style={styles.text}>
            Thanks for your subscription to <strong>{templateName}</strong> on KILN.
          </Text>
          
          <Section style={styles.receiptBox}>
            <Text style={styles.receiptRow}>
              <span>Template:</span>
              <span style={styles.receiptValue}>{templateName}</span>
            </Text>
            <Text style={styles.receiptRow}>
              <span>Date:</span>
              <span style={styles.receiptValue}>{date}</span>
            </Text>
            <Text style={styles.receiptRow}>
              <span>Amount:</span>
              <span style={styles.receiptAmount}>${amount.toFixed(2)}</span>
            </Text>
            <Text style={styles.receiptRow}>
              <span>Status:</span>
              <span style={styles.receiptStatus}>Paid ✅</span>
            </Text>
          </Section>
          
          <Text style={styles.note}>
            This receipt was automatically generated for your records. 
            No action is required.
          </Text>
          
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Questions about your subscription?{' '}
              <Link href="mailto:support@kiln.build">Contact support</Link>
            </Text>
            <Text style={styles.footerText}>
              <Link href="https://app.kiln.build/billing">Manage subscription</Link>
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
  receiptBox: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "24px",
    marginBottom: "24px",
    border: "1px solid #e5e5e5",
  },
  receiptRow: {
    fontSize: "16px",
    lineHeight: "32px",
    color: "#333",
    display: "flex",
    justifyContent: "space-between",
  },
  receiptValue: {
    fontWeight: "500",
  },
  receiptAmount: {
    fontWeight: "700",
    fontSize: "20px",
    color: "#1a1a1a",
  },
  receiptStatus: {
    fontWeight: "600",
    color: "#16a34a",
  },
  note: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "24px",
  },
  footer: {
    marginTop: "32px",
    paddingTop: "24px",
    borderTop: "1px solid #e5e5e5",
  },
  footerText: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
  },
};
