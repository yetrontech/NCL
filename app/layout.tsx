import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { GOOGLE_ADS_ID } from "@/lib/google-ads";
import { loadSiteContent } from "@/lib/site-content-server";

const SITE_URL = "https://www.newcreationliving.org";

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadSiteContent();
  const title =
    content["seo.title"] || "New Creation Living — Structured Housing on Fixed Income";
  const description =
    content["seo.description"] ||
    "New Creation Living provides all-inclusive homes for independent adults on fixed incomes. We also help individuals access and obtain government benefits and resources they may qualify for. Our goal is to provide safe, supportive housing and help individuals build greater stability and independence.";

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: "New Creation Living",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
