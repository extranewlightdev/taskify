import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taskify",
  description: "Taskify: Your all-in-one productivity workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen w-full relative`}
        style={{
          fontFamily: 'var(--font-geist-sans)',
        }}
      >
        {/* Animated Gradient Background */}
        <div className="fixed inset-0 -z-10 animate-gradient bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 dark:from-[#232526] dark:via-[#414345] dark:to-[#232526]" style={{backgroundSize:'400% 400%'}} />
        {/* Glassmorphism Main Container */}
        <div className="min-h-screen w-full flex flex-col items-center justify-center">
          {/* Top Navigation Bar Slot */}
          <div id="top-navbar" className="w-full max-w-6xl mx-auto pt-8 pb-4" />
          {/* Main Content */}
          <main className="w-full max-w-6xl mx-auto bg-white/60 dark:bg-black/40 backdrop-blur-lg rounded-3xl shadow-xl p-6 sm:p-12 mt-4 mb-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
