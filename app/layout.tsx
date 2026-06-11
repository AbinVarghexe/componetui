import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gamin UI Registry",
  description: "A refined component registry with an Apple-inspired presentation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {children}
        <Script 
          src="https://unpkg.com/@lottiefiles/lottie-player@2.0.4/dist/lottie-player.js" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  );
}
