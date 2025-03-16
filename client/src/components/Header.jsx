import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { dateStore } from '../store/dateStore';
import { userStore } from '../store/userStore';
import { observer } from 'mobx-react-lite';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { IoChevronBack, IoChevronForward, IoSettingsSharp } from 'react-icons/io5'; // Импорт иконки настроек

const Header = observer(() => {
	const navigate = useNavigate();
	const location = useLocation();

	const getActiveViewFromPath = useCallback(() => {
		const path = location.pathname.replace("/", ""); // Remove leading "/"
		const validViews = ["day", "week", "month", "year"];
		return validViews.includes(path) ? path.charAt(0).toUpperCase() + path.slice(1) : "Year";
	}, [location.pathname]); // Dependency added

	const [activeView, setActiveView] = useState(getActiveViewFromPath);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleNavigation = view => {
		setActiveView(view);
		navigate(`/${view.toLowerCase()}`);
	};

	useEffect(() => {
		setActiveView(getActiveViewFromPath());
	}, [location.pathname, getActiveViewFromPath]);

	useEffect(() => {
		const handleClickOutside = event => {
			if (!event.target.closest('.dropdown')) {
				setIsMenuOpen(false);
			}
		};

		if (isMenuOpen) {
			document.addEventListener('click', handleClickOutside);
		}

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [isMenuOpen]);

	return (
		<div className='flex items-center justify-between w-full p-2 text-black bg-purple-200 shadow-md gradient'>
			<h1 className='hidden ml-4 text-2xl font-bold sm:block text-gradient'>
				<Link to='/'>CloOk</Link>
			</h1>

			<div className='flex items-center'>
				<div className='dropdown dropdown-end'>
					<div tabIndex={0} role='button' className='flex items-center justify-between w-32 header-btn' onClick={() => setIsMenuOpen(!isMenuOpen)}>
						{activeView}
						{isMenuOpen ? <IoMdArrowDropup size={20} className='pointer-events-none' /> : <IoMdArrowDropdown size={20} className='pointer-events-none' />}
					</div>
					{isMenuOpen && (
						<ul tabIndex={0} className='dropdown-content bg-white border border-[#dadce0] rounded-md shadow-md z-50 w-32 p-2'>
							{['Day', 'Week', 'Month', 'Year'].map(view => (
								<li key={view}>
									<p
										className={`cursor-pointer p-2 rounded ${activeView === view ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
										onClick={() => {
											handleNavigation(view);
											setIsMenuOpen(false);
										}}
									>
										{view}
									</p>
								</li>
							))}
						</ul>
					)}
				</div>

				<button className='header-btn' onClick={() => dateStore.today()}>
					Today
				</button>
				<button className='header-btn' onClick={() => dateStore.prev(activeView.toLowerCase())}>
					<IoChevronBack size={18} />
				</button>
				<button className='header-btn' onClick={() => dateStore.next(activeView.toLowerCase())}>
					<IoChevronForward size={18} />
				</button>
				<button className='header-btn' onClick={() => console.log("pidr")}>
					Sex
				</button>

				{userStore.user === null ? (
					<button className='header-btn' onClick={() => navigate('/login')}>
						Login
					</button>
				) : (
					<button className='header-btn' onClick={() => navigate('/settings')}>
						<IoSettingsSharp size={20} />
					</button>
				)}
			</div>
		</div>
	);
});

export default Header;
