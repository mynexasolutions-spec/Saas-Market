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
  metadataBase: new URL("https://www.saasmrkt.com"),
  title: {
    default: "SaaS Market - Discover. Compare. Buy. Powerful SaaS Products.",
    template: "%s | SaaS Market",
  },
  description:
    "SaaS Market is a dedicated platform where buyers can discover, compare and purchase SaaS products, and sellers can list, showcase and grow their SaaS business.",
  keywords: [
    "SaaS Marketplace",
    "Software Comparison",
    "Buy SaaS",
    "HR & Payroll",
    "CRM Software",
    "Project Management Tools",
    "Developer Tools",
    "Accounting Software",
    "B2B Software",
    "SaaS Deals",
  ],
  authors: [{ name: "SaaS Market Inc.", url: "https://www.saasmrkt.com" }],
  creator: "SaaS Market Inc.",
  publisher: "SaaS Market Inc.",
  alternates: {
    canonical: "https://www.saasmrkt.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.saasmrkt.com",
    siteName: "SaaS Market",
    title: "SaaS Market - Discover. Compare. Buy. Powerful SaaS Products.",
    description:
      "Explore top SaaS software for HR, CRM, Marketing, Finance, and Project Management. Compare features, pricing, and authentic buyer reviews.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Market - Discover. Compare. Buy. Powerful SaaS Products.",
    description:
      "Explore top SaaS software for HR, CRM, Marketing, Finance, and Project Management. The modern software marketplace.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.saasmrkt.com/#website",
        url: "https://www.saasmrkt.com",
        name: "SaaS Market",
        description:
          "Discover, compare, and buy top SaaS products for modern businesses.",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://www.saasmrkt.com/products?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://www.saasmrkt.com/#organization",
        name: "SaaS Market",
        url: "https://www.saasmrkt.com",
      },
    ],
  };

  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
