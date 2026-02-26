import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "#nismofejk — Slovenija govori",
  description: "Prva anketa, kjer politiki in državljani povedo resnico — brez filtra. Skupaj vidimo celotno sliko.",
  openGraph: {
    title: "#nismofejk — Slovenija govori",
    description: "Prva anketa za vsakega Slovenca in vsakega politika. Brez filtra. Brez PR-a.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
