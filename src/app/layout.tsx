import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import LoadingScreenProvider from "@/providers/LoadingScreenProvider";
import BottomMenus from "@/components/layouts/BottomMenus";

import AuthProviderWithSuspense from "@/providers/AuthProvider";
import toast, { Toaster } from "react-hot-toast";
import TopNavBar from "@/components/navigation/TopNavBar";
import BottomNavBar from "@/components/navigation/BottomNavBar";
import ReactQueryProvider from "@/providers/react-query-provider";
import Head from "next/head";

const montserrat = Poppins({ weight: ['100',"200",'300',"400","500","600","700","800","900"], subsets: ["latin"] });

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
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
      </Head>
      <body className={`${montserrat.className} min-h-screen   h-screen  `}>
        {/* <TonConnectUIProvider manifestUrl="https://beestar-kombat-ten.vercel.app/tonconnect-manifest.json"> */}
        <AuthProviderWithSuspense>
          <ReactQueryProvider>

          <LoadingScreenProvider>

            <main className="min-h-screen relative  flex flex-col justify-between  text-white/80">
            <TopNavBar/>
              {children}
              <BottomNavBar/>
            </main>
          </LoadingScreenProvider>
          </ReactQueryProvider>
        </AuthProviderWithSuspense>
        <Toaster
          toastOptions={{
            className: "",
            style: {
              border: "0px solid #713200",
              padding: "6px",
              color: "#ffffff",
              fontSize: "10px",
              backgroundColor: "#1d2025",
            },
          }}
        />
        {/* </TonConnectUIProvider> */}
      </body>
    </html>
  );
}
