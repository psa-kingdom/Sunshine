import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Libre_Baskerville } from "next/font/google";
import "./globals.css";

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
  title: "Sunshine Public School | Shaping Curious Minds. Building Confident Futures.",
  description:
    "A premier CBSE-affiliated institution in Gurugram nurturing academic excellence, character, creativity, and holistic development since 1998.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/hero-school.webp" />
      </head>
      <body
        className={`${cormorant.variable} ${inter.variable} ${libreBaskerville.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
