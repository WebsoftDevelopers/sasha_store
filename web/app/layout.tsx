import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "aos/dist/aos.css";
import "./globals.css";
import { Providers } from "./providers";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display-family",
  display: "swap",
});

const body = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shasha Fragrance",
  description:
    "Shasha Fragrance — Port Harcourt marketplace for fragrance, perfume, body care, and beauty across Nigeria. Browse products without login.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-[var(--font-body)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
