'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { initBackButton } from '@telegram-apps/sdk';
import { useTaskStore } from '@/store/useTaskStore';
import { useFetchTasks } from '@/hooks/query/useFetchTask';

const BottomNavBar = () => {
	const NavigationItems = [
		{
			name: 'Mine',
			icon: (
				<Image
					src="/newImages/mine.png"
					width={24}
					height={24}
					className="w-6 h-6 mx-auto"
					alt="Mine"
				/>
			),
			selectedIcon: (
				<Image
					src="/newImages/mine-selected.png"
					width={24}
					height={24}
					className="w-6 h-6 mx-auto"
					alt="Mine"
				/>
			),
			link: '/tasks',
		},
		{
			name: 'Friends',
			icon: (
				<Image
					src="/newImages/playgame.png"
					width={24}
					height={24}
					className="w-6 h-6 mx-auto"
					alt="Friends"
				/>
			),
			selectedIcon: (
				<Image
					src="/newImages/playgame-selected.png"
					width={24}
					height={24}
					className="w-6 h-6 mx-auto"
					alt="Mine"
				/>
			),
			link: '/referrals',
		},
		{
			name: 'Home',
			icon: (
				<Image
					src="/newImages/home.png"
					width={24}
					height={24}
					className="w-6 h-6 mx-auto"
					alt="Home"
				/>
			),
			selectedIcon: (
				<Image
					src="/newImages/home-selected.png"
					width={24}
					height={24}
					className="w-6 h-6 mx-auto"
					alt="Mine"
				/>
			),
			link: '/',
		},
		{
			name: 'Earn',
			icon: (
				<Image
					src="/newImages/earn.png"
					width={24}
					height={24}
					className="w-6 h-6 mx-auto"
					alt="Earn"
				/>
			),
			selectedIcon: (
				<Image
					src="/newImages/earn-selected.png"
					width={24}
					height={24}
					className="w-6 h-6 mx-auto"
					alt="Mine"
				/>
			),
			link: '/earn',
		},
		{
			name: 'AirDrop',
			icon: (
				<Image
					src="/newImages/airdrop.png"
					width={24}
					height={24}
					alt="AirDrop"
				/>
			),
			selectedIcon: (
				<Image
					src="/newImages/airdrop-selected.png"
					width={24}
					height={24}
					className="w-6 h-6 mx-auto"
					alt="Mine"
				/>
			),
			link: '/airdrop',
		},
	];

	const route = useRouter();
	const pathname = usePathname();

	const search = useSearchParams();

	const id: string = search.get('id') ?? '';

	const handleRoute = (link: string) => {
		const linkWithId = id ? `${link}?id=${id}` : link;
		route.push(linkWithId);
	};

	const { data: taskList, isLoading } = useFetchTasks(id);
	console.log('🚀 ~ BottomNavBar ~ taskList:', taskList);

	useEffect(() => {
		function initTg() {
			if (typeof window !== 'undefined') {
				const [backButton] = initBackButton();
				backButton.show();
				// Conditionally show or hide the back button based on the current route
				if (pathname === '/') {
					// If on home screen, hide the back button
					backButton.hide();
				} else {
					// Otherwise, show the back button and set up its behavior
					backButton.show();
					backButton.on('click', () => window.history.back());
				}
			} else {
				console.log('Telegram WebApp is undefined, retrying…');
				setTimeout(initTg, 500);
			}
		}
		initTg();


	}, [pathname]);

	return (
		<div
			className="sticky bottom-0 xs:bottom-10 max-w-[370px] w-full px-6 pt-3 pb-1 mx-auto  flex  justify-around items-center  text-xs 
      bg-[url('/newImages/bottom-navbar.png')] bg-contain bg-center bg-no-repeat z-50 h-20"
		>
			{NavigationItems.map((item, index) => {
				return (
					<div
						key={index}
						className="flex flex-col items-center justify-center gap-1 "
					>
						<button
							onClick={() => handleRoute(item.link)}
							className={`relative flex items-center justify-center flex-col`}
						>
							<div className='absolute -top-1 right-0'>
							{item.link === '/earn' && taskList?.isNewTask && (
								<span className="relative flex h-3 w-3">
									<span className="animate-ping absolute  inline-flex h-full w-full rounded-full bg-custom-orange opacity-75"></span>
									<span className="relative inline-flex rounded-full h-3 w-3 bg-custom-orange"></span>
								</span>
							)}
							</div>
							<div
								className={`${
									pathname === item.link ? ' text-custom-orange mb-1' : ''
								} mx-auto  flex items-center justify-center flex-col gap-2`}
							>
								{pathname === item.link ? item.selectedIcon : item.icon}

								{item.name}
							</div>
						</button>
						<div
							className={` ${
								pathname === item.link &&
								'w-0 h-0 rounded-3xl border-l-[10px] border-r-[10px] border-b-[12px] border-l-transparent border-r-transparent border-custom-orange rounded-triangle'
							}`}
						></div>
					</div>
				);
			})}
		</div>
	);
};

export default BottomNavBar;
