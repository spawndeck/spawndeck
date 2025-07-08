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
  title: "Spawndeck - Manage Multiple Claude Code Instances",
  description: "A powerful CLI tool for managing multiple Claude Code instances in parallel using Git worktrees. Work on different features simultaneously without conflicts.",
  keywords: ["spawndeck", "claude code", "git worktrees", "parallel development", "cli tool"],
  openGraph: {
    title: "Spawndeck - Manage Multiple Claude Code Instances",
    description: "A powerful CLI tool for managing multiple Claude Code instances in parallel using Git worktrees.",
    url: "https://spawndeck.com",
    siteName: "Spawndeck",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
