import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KILN — Fire your SaaS.",
  description: "Pick a template. Configure your keys. Ship a deployed, monetized business in 30 minutes.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23E85D26'/><text y='.9em' x='50%' text-anchor='middle' font-size='70' font-family='Georgia'>K</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
