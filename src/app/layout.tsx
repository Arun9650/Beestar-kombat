import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import LoadingScreenProvider from '@/providers/LoadingScreenProvider';


import AuthProviderWithSuspense from '@/providers/AuthProvider';
import toast, { Toaster } from 'react-hot-toast';
import BottomNavBar from '@/components/navigation/BottomNavBar';
import ReactQueryProvider from '@/providers/react-query-provider';
import Head from 'next/head';
import Script from 'next/script';
import ParentComponent from '@/components/preventZoomParent';

const montserrat = Poppins({
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Beestar - Telegram Kombat',
	description: 'Beestar - Telegram Kombat',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
				/>
				{/* Open Graph Meta Tags */}
				<meta property="og:title" content="Beestar - Telegram Kombat" />
				<meta
					property="og:description"
					content="Join the ultimate Telegram Kombat and be a part of Beestar!"
				/>
				<meta
					property="og:image"
					content="https://raw.githubusercontent.com/Arun9650/Beestar-kombat/main/public/newImages/BeeMain.png"
				/>
				<meta property="og:type" content="website" />
			</Head>
			<Script
				async
				src="https://telegram.org/js/telegram-widget.js?22"
			></Script>
			<Script src="https://sad.adsgram.ai/js/sad.min.js"></Script>
			<body className={`${montserrat.className} min-h-screen h-screen`}>
				{/* <TonConnectUIProvider manifestUrl="https://beestar-kombat-ten.vercel.app/tonconnect-manifest.json"> */}
				<AuthProviderWithSuspense>
					<ReactQueryProvider>
						<ParentComponent>
							<LoadingScreenProvider>
								<main className="min-h-screen relative h-full p-4 xs:p-8 flex flex-col justify-between text-white/80">
									{children}
									<BottomNavBar />
								</main>
							</LoadingScreenProvider>
						</ParentComponent>
					</ReactQueryProvider>
				</AuthProviderWithSuspense>
				<Toaster
					toastOptions={{
						className: '',
						style: {
							border: '0px solid #713200',
							padding: '6px',
							color: '#ffffff',
							fontSize: '10px',
							backgroundColor: '#1d2025',
						},
					}}
				/>
				{/* </TonConnectUIProvider> */}
			</body>
		</html>
	);
}
