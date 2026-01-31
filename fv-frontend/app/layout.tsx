import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FV Auto Importaciones",
  description: "E-commerce de repuestos y accesorios automotrices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.className} racing-backdrop`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
