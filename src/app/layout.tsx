import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ahsan Nayaz - AI Engineer Portfolio",
  description: "Interactive portfolio of AI Engineer Ahsan Nayaz, featuring an OS-like interface showcasing projects, skills, and experience in machine learning and artificial intelligence.",
  keywords: "AI Engineer, Machine Learning, Deep Learning, Portfolio, Ahsan Nayaz",
  authors: [{ name: "Ahsan Nayaz" }],
  openGraph: {
    title: "Ahsan Nayaz - AI Engineer Portfolio",
    description: "Explore my work in AI and machine learning through an interactive OS-like interface",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
