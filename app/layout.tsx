import type { Metadata, Viewport } from "next";
import { Saira, Saira_Condensed, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Engineered grotesk family — "aerospace instrument" feel, strong numerals.
const saira = Saira({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

// Condensed industrial display for headings.
const sairaCondensed = Saira_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Compact mono for metrics, parameters, and instrument labels.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://inokilabs.github.io"),
  title: "BreakPoint — Inoki Labs",
  description:
    "BreakPoint is an adversarial simulation engine that finds robot policy failure modes and turns them into targeted retraining data.",
  keywords: [
    "robot policy",
    "reinforcement learning",
    "Isaac Lab",
    "MuJoCo MJX",
    "sim-to-real",
    "domain randomization",
    "robotics reliability",
    "Unitree Go2",
  ],
  authors: [{ name: "Inoki Labs" }],
  openGraph: {
    title: "BreakPoint — find robot policy failures before deployment",
    description:
      "Adversarial simulation that finds robot policy failures and turns them into retraining data.",
    type: "website",
    siteName: "Inoki Labs",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${saira.variable} ${sairaCondensed.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
