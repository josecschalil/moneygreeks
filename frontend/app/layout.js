import { Geist, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "MoneyGreeks | Finance Insights and Market Research",
  description:
    "MoneyGreeks provides pre-market reports, trading education, market insights, and finance resources for active traders.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${inter.variable} antialiased`}>
        <Navbar />
        <Analytics />
        {children}
        <Footer />
      </body>
    </html>
  );
}
