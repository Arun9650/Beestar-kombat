import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import LoadingScreenProvider from '@/providers/LoadingScreenProvider';
// import '../../mocke'

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
			<Script
				async
				src="https://telegram.org/js/telegram-widget.js?22"
			></Script>
			<Script src="https://ads.giga.pub/script?id=110"></Script>
			<Script src="https://sad.adsgram.ai/js/sad.min.js"></Script>
			<Script src="https://telegram.org/js/telegram-web-app.js?56"></Script>
			<Script src="https://richinfo.co/richpartners/telegram/js/tg-ob.js"></Script>
			<Script src="https://richinfo.co/richpartners/telegram/js/rp-ob.js?pub_id=949633&widget_id=354734" async data-cfasync="false"></Script>

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
