import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = "Pioneer 1st Ward Sacrament Meetings";
const siteDescription =
  "Weekly sacrament meeting agendas, speaker schedules, hymns, and printable bulletins for the Pioneer 1st Ward.";

// URL base para las rutas absolutas de Open Graph (Vercel da la URL de producción)
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sacrament Meeting Planner — Pioneer 1st Ward",
    // Las páginas solo ponen su parte: "Meetings" → "Meetings | Pioneer 1st Ward…"
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: "Sacrament Meeting Planner",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName,
    title: "Sacrament Meeting Planner — Pioneer 1st Ward",
    description: siteDescription,
    url: "/",
    // La imagen la genera app/opengraph-image.tsx automáticamente
  },
  twitter: {
    card: "summary_large_image",
    title: "Sacrament Meeting Planner — Pioneer 1st Ward",
    description: siteDescription,
  },
  icons: {
    icon: "/church-symbol.png",
    shortcut: "/favicon.ico",
    apple: "/church-symbol.png",
  },
};

export interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
