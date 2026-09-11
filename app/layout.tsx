import type { Metadata } from "next";
import "./globals.css";
import { GOOGLE_ADS_ID, GOOGLE_TAG_MANAGER_ID } from "@/lib/google-ads";
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
        {/* Google Tag Manager must be server-rendered so Tag Assistant sees it on first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GOOGLE_TAG_MANAGER_ID}');
            `,
          }}
        />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              window.gtag=gtag;
              gtag('js',new Date());
              gtag('config','${GOOGLE_ADS_ID}');
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
