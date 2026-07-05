import type { Metadata, Viewport } from "next";
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
  title: "Aswin Panengal — AI Engineer",
  description: "Aswin Panengal — AI Engineer building RAG pipelines, LLM agents, and full-stack AI applications.",
  openGraph: {
    title: "Aswin Panengal — AI Engineer",
    description: "AI Engineer building RAG pipelines, LLM agents, and full-stack AI applications.",
    url: "https://aswinpanengal.vercel.app",
    siteName: "Aswin Panengal",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Aswin Panengal — AI Engineer",
    description: "AI Engineer building RAG pipelines, LLM agents, and full-stack AI applications.",
  },
};

// viewport-fit=cover populates env(safe-area-inset-*) on iOS notch / Dynamic Island devices
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
