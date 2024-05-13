import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cinopolis | A platform guide",
  description: "A platform guide for those looking for movies or tv shows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-thumb-blue-600 scrollbar scrollbar-track-blue-800">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
