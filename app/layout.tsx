import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";
import { UploadThingProvider } from "@/components/UploadThingProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InternConnect - Modern Internship Platform",
  description: "Connect with the best internship opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <UploadThingProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </UploadThingProvider>
        </Providers>
      </body>
    </html>
  );
}
