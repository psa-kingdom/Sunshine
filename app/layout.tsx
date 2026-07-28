import type { Metadata } from "next";
import { Fredoka, Nunito, Outfit } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sunshine Public School | Learning • Leadership • Character",
  description: "A premier CBSE affiliated institution nurturing future leaders in Gurugram since 1998.",
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
        className={`${fredoka.variable} ${nunito.variable} ${outfit.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
