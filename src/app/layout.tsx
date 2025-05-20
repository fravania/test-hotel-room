import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import Sidebar from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hotel Reservation Admin Dashboard",
  description: "Admin dashboard for hotel reservation management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
              <div className="container flex h-14 items-center">
                <div className="md:hidden">
                  <Link className="flex items-center gap-2 font-bold" href="/">
                    <span>Hotel Admin</span>
                  </Link>
                </div>
              </div>
            </header>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
