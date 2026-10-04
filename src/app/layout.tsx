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
  title: "SaaS MRKT - Discover. Compare. Buy. Powerful SaaS Products.",
  description:
    "SaaS MRKT is a dedicated platform where buyers can discover, compare and purchase SaaS products, and sellers can list, showcase and grow their SaaS business.",
  keywords: [
    "SaaS MRKTplace",
    "Software Comparison",
    "Buy SaaS",
    "HR & Payroll",
    "CRM",
    "Project Management",
    "Developer Tools",
    "Accounting Software",
  ],
  authors: [{ name: "SaaS MRKT Inc." }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
