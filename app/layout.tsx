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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
