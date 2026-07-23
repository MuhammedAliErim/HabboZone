import type { Metadata } from "next";
import { Ubuntu, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import RadioPlayer from "@/components/RadioPlayer";

const ubuntu = Ubuntu({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-ubuntu",
});

const pixelifySans = Pixelify_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-pixelify",
});

export const metadata: Metadata = {
  title: "HabboZone",
  description: "Modern Habbo Community and Magazine Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ubuntu.variable} ${pixelifySans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans relative">
        <div className="bg-animated-pattern"></div>
        <ThemeProvider>
          {children}
          <RadioPlayer />
        </ThemeProvider>
      </body>
    </html>
  );
}
