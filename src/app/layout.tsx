import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5E4BEE",
};

export const metadata: Metadata = {
  title: "SaaS Market - Discover. Compare. Buy. Powerful SaaS Products.",
  description:
    "SaaS Market is a dedicated platform where buyers can discover, compare and purchase SaaS products, and sellers can list, showcase and grow their SaaS business.",
  keywords: [
    "SaaS Marketplace",
    "Software Comparison",
    "Buy SaaS",
    "HR & Payroll",
    "CRM",
    "Project Management",
    "Developer Tools",
    "Accounting Software",
  ],
  authors: [{ name: "SaaS Market Inc." }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
