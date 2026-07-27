import type { Metadata } from "next";
import { Cinzel, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
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
        className={`${cinzel.variable} ${outfit.variable} ${jakarta.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
