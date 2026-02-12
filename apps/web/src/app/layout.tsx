import React from "react";

import { Inter } from "next/font/google";
import "./_styles/globals.css";
import { Header } from "./_components/Header";
import { Main } from "./_components/Main";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <Main>
          {children}
        </Main>
      </body>
    </html>
  );
}
