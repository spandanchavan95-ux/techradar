import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Fixed the double semicolon

const inter = Inter({ subsets: ["latin"] });

// 1. PWA Viewport Settings (Mobile fullscreen)
export const viewport: Viewport = {
  themeColor: "#10B981", // Set to your emerald green brand color
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// 2. Combined Metadata (Your SEO + PWA App config)
export const metadata: Metadata = {
  title: "Techpulse | Opportunity Engine",
  description: "Real-time discovery engine for early-career developers.",
  manifest: '/manifest.json', 
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Techpulse',
  },
  // themeColor has been completely surgically removed from here
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