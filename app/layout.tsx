import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";


export const metadata: Metadata = {
  title: "Glamira Essence",
  description: "Premium skincare and beauty products",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">

      <body>

        <Navbar />

        <Hero />

        {children}

      </body>

    </html>
  );
}