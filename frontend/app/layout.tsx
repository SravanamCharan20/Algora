import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./utils/userContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Algora",
  description: "Private coding rooms with a sharper, production-grade interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f5f3ee] text-[#0f1115] [font-family:var(--font-manrope)] selection:bg-[#0f1115] selection:text-[#f5f3ee]">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
