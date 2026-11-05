import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "StudioSpace",
  description: "Converting spaces into stages for creative productions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      style={{ scrollBehavior: "smooth" }}
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
