import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // fixed path to remove the TypeScript error 

const inter = Inter({ subsets: ["latin"] });

// 1. PWA Viewport Settings (Mobile fullscreen)
export const viewport: Viewport = {
  themeColor: '#050810',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// 2. Combined Metadata (Your SEO + PWA App config)
export const metadata: Metadata = {
  title: "TechRadar | Opportunity Engine",
  description: "Real-time discovery engine for early-career developers.",
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TechRadar',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased min-h-screen bg-slate-950 text-slate-50`}>
        {children}
      </body>
    </html>
  );
}