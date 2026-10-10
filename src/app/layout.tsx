import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
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
    default: "SaaS MRKT — B2B SaaS Marketplace Platform & Software Discovery",
    template: "%s | SaaS MRKT",
  },
  description:
    "Explore SaaS MRKT, the leading multi-vendor B2B SaaS marketplace platform. Discover, compare, and acquire verified marketplace for SaaS products, cloud tools, and fintech solutions with transparent pricing and 0% commission.",
  keywords: [
    "SaaS MRKT",
    "SaaS marketplace",
    "B2B SaaS marketplace",
    "SaaS marketplace platform",
    "marketplace for SaaS products",
    "multi vendor marketplace SaaS",
    "marketplace SaaS platform",
    "SaaS based marketplace",
    "SaaS enabled marketplace",
    "marketplace SaaS solution",
    "marketplace SaaS software",
    "AWS marketplace SaaS alternative",
    "Azure marketplace SaaS alternative",
    "GCP marketplace listing requirements for SaaS",
    "SaaS payment gateways alternatives",
    "SaaS vs marketplace",
    "SaaS vs marketplace revenue multiples",
    "XBERT SaaS fintech marketplace",
    "Software Comparison",
    "Buy SaaS Software",
    "B2B Software Directory",
    "Developer Tools",
    "CRM Software",
    "HR & Payroll",
    "Accounting Software",
  ],
  authors: [{ name: "SaaS MRKT Inc.", url: "https://www.saasmrkt.com" }],
  creator: "SaaS MRKT Inc.",
  publisher: "SaaS MRKT Inc.",
  alternates: {
    canonical: "https://www.saasmrkt.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.saasmrkt.com",
    siteName: "SaaS MRKT",
    title: "SaaS MRKT — Modern SaaS Marketplace & Software Discovery",
    description:
      "Discover, compare, and buy verified B2B software solutions. Explore 2,000+ top SaaS applications with transparent pricing and real user reviews.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SaaS MRKT",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS MRKT — Modern SaaS Marketplace & Software Discovery",
    description:
      "Discover, compare, and buy verified B2B software solutions. Explore 2,000+ top SaaS applications with transparent pricing and real user reviews.",
    images: ["/og-image.png"],
    creator: "@saasmrkt",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};


  // Structured Data for Google Sitelinks & Organization
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SaaS MRKT",
    alternateName: ["SaaS Marketplace", "SaaSMRKT"],
    url: "https://www.saasmrkt.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.saasmrkt.com/products?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SaaS MRKT",
    url: "https://www.saasmrkt.com",
    logo: "https://www.saasmrkt.com/logo.png",
    sameAs: [
      "https://twitter.com/saasmrkt",
      "https://linkedin.com/company/saasmrkt",
      "https://github.com/saasmrkt",
    ],
    description:
      "A modern marketplace for discovering, evaluating, and procuring business software.",
  };

  const sitelinksNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "SiteNavigationElement",
        position: 1,
        name: "Explore Products",
        description: "Browse 2,000+ vetted SaaS applications with transparent pricing.",
        url: "https://www.saasmrkt.com/products",
      },
      {
        "@type": "SiteNavigationElement",
        position: 2,
        name: "Software Categories",
        description: "Explore categorized tools across AI, CRM, DevTools, Marketing, and Security.",
        url: "https://www.saasmrkt.com/categories",
      },
      {
        "@type": "SiteNavigationElement",
        position: 3,
        name: "For Buyers",
        description: "How modern teams discover verified software, compare specs, and negotiate contracts.",
        url: "https://www.saasmrkt.com/buyers",
      },
      {
        "@type": "SiteNavigationElement",
        position: 4,
        name: "For Sellers",
        description: "List your software product in front of 50,000+ qualified buyers with 0% commission.",
        url: "https://www.saasmrkt.com/sellers",
      },
      {
        "@type": "SiteNavigationElement",
        position: 5,
        name: "How It Works",
        description: "Learn how the end-to-end software discovery and review verification process works.",
        url: "https://www.saasmrkt.com/how-it-works",
      },
    ],
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sitelinksNavigationSchema) }}
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
