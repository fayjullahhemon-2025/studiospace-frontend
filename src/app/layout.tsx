import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";

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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Suspense>
            <Navbar />
          </Suspense>
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="colored"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
