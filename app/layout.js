import React from 'react';
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WIshlistContext";
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {AuthProvider} from "@/components/Provider";
import { Merriweather, Lato } from "next/font/google";
import Script from 'next/script'

const merriweather = Merriweather({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-merriweather",
  weight: ['300', '400', '700', '900'],
});

const lato = Lato({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lato",
  weight: ['100', '300', '400', '700', '900'],
});

export const metadata = {
  title: "Cozy Bookstore",
  description: "A warm and inviting online bookstore",
};

export default function RootLayout({ children }) {
  return (
    <>
    <html lang="en" className={`${merriweather.variable} ${lato.variable}`}>
      <body suppressHydrationWarning={true} className="flex flex-col min-h-screen w-full bg-warmWhite text-warmGray-800">
      <AuthProvider>
      <Toaster/>
      <CartProvider>
      <WishlistProvider>
       <Navbar />
        <main className="flex-grow p-6 md:p-8 lg:p-10">
          {children}
        </main>
        <Analytics />
        </WishlistProvider>
        </CartProvider>
        <Footer/>
        </AuthProvider>
      </body>
    </html>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}