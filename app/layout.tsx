import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SCHOOL_INFO } from "@/lib/constants";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SCHOOL_INFO.name} | ${SCHOOL_INFO.tagline} • ${SCHOOL_INFO.subTagline}`,
  description: `A premier ${SCHOOL_INFO.affiliation}-affiliated institution in ${SCHOOL_INFO.address.cityState} (${SCHOOL_INFO.classes}) nurturing academic excellence, character, and holistic development since ${SCHOOL_INFO.established}.`,
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/ssps logo dark.png",
    shortcut: "/ssps logo dark.png",
    apple: "/ssps logo dark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SCHOOL_INFO.name,
    url: SCHOOL_INFO.websiteUrl,
    telephone: [SCHOOL_INFO.phone.primary, SCHOOL_INFO.phone.secondary],
    email: SCHOOL_INFO.email.primary,
    address: {
      "@type": "PostalAddress",
      streetAddress: SCHOOL_INFO.address.street,
      addressLocality: SCHOOL_INFO.address.city,
      addressRegion: SCHOOL_INFO.address.state,
      postalCode: SCHOOL_INFO.address.pincode,
      addressCountry: "IN",
    },
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('sunshine_theme');var t;if(s==='light'||s==='dark'){t=s;}else{t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preload" as="image" href="/hero-school.webp" />
      </head>
      <body
        className={`${cormorant.variable} ${inter.variable} ${libreBaskerville.variable}`}
        suppressHydrationWarning
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
