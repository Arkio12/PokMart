import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { PokemonProvider } from "@/context/PokemonContext";
import { ConditionalLayout } from "@/components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PokéMart - Your Ultimate Pokemon Store",
  description: "Discover and collect your favorite Pokemon with PokéMart. The best selection of Pokemon, items, and accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <PokemonProvider>
            <CartProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </CartProvider>
          </PokemonProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
