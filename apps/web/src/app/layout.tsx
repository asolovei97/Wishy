import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/app/_styles/globals.css";
import { Header } from "./_components";

export const metadata: Metadata = {
  title: {
    template: "%s | Wishy",
    default: "Welcome | Wishy",
  },
  description: "Wishy description",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
