import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

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
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('sunshine_theme');var t;if(s==='light'||s==='dark'){t=s;}else{t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`,
          }}
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
