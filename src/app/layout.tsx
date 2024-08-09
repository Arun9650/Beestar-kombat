import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import LoadingScreenProvider from "@/providers/LoadingScreenProvider";
import AuthProviderWithSuspense from "@/providers/AuthProvider";
import { Toaster } from "react-hot-toast";
import TopNavBar from "@/components/navigation/TopNavBar";
import BottomNavBar from "@/components/navigation/BottomNavBar";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--montserat" });

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
      <body className={`${montserrat.className} min-h-screen   h-screen  `}>
        {/* <TonConnectUIProvider manifestUrl="https://beestar-kombat-ten.vercel.app/tonconnect-manifest.json"> */}
        <AuthProviderWithSuspense>
          <LoadingScreenProvider>
            <main className=" min-h-screen relative  flex flex-col  text-white/80">
            <TopNavBar/>
              {children}
              <BottomNavBar/>
            </main>
          </LoadingScreenProvider>
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
