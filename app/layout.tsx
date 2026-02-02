import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Stacko | Custom Collectible Figures",
  description: "Your ultimate destination for custom collectible figures. Personalized Mini'Me figurines, lamps, and keychains made with love.",
  keywords: ["collectibles", "custom figurines", "mini me", "personalized gifts", "custom lamps", "keychains"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${poppins.variable} font-poppins antialiased bg-white`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
