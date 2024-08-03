import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import LoadingScreenProvider from "@/providers/LoadingScreenProvider";
import BottomMenus from "@/components/layouts/BottomMenus";
import AuthProvider from "@/providers/AuthProvider";
import { ToastContainer } from 'react-toastify'
import "react-toastify/ReactToastify.css"

const montserrat = Montserrat({ subsets: ["latin"], variable: '--montserat' });

export const metadata: Metadata = {
  title: "Beestar - Telegram Kombat",
  description: "Beestar - Telegram Kombat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} min-h-screen max-h-screen h-screen bg-[#1d2025] `}>
      <AuthProvider>
          <LoadingScreenProvider>
            <main className="h-[calc(100vh-80px)] backdrop-blur-[3px] bg-black text-white/80">
              {children}
            </main>
            <BottomMenus />
          </LoadingScreenProvider>
      </AuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
