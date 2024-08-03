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
      <body className={`${montserrat.className} min-h-screen max-h-screen h-screen`}>
      
          <LoadingScreenProvider>
            <main className="h-screen  backdrop-blur-[3px] bg-black text-white/80 py-10 px-4">
              {children}
            </main>
            <BottomMenus />
          </LoadingScreenProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
