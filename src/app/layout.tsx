import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css"; // Fixed import to use absolute path

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechRadar | Opportunity Engine",
  description: "Real-time discovery engine for early-career developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {/* REMOVED the 'flex' class that was crushing the layout */}
      <body className={`${inter.className} antialiased min-h-screen bg-slate-950 text-slate-50`}>
        {children}
      </body>
    </html>
  );
}