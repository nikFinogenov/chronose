import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { dateStore } from '../store/dateStore';
import { userStore } from '../store/userStore';
import { observer } from 'mobx-react-lite';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { IoChevronBack, IoChevronForward, IoSettingsSharp } from 'react-icons/io5'; // Импорт иконки настроек
import EventModal from './EventModal';
import { eventStore } from '../store/eventStore';

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
	const [showModal, setShowModal] = useState(false); // State for modal
    const [newEvent, setNewEvent] = useState({
        title: "",
        start: null,
        end: null,
        description: "",
        location: "",
        participants: [],
        color: "#34ebc6",
    });

	const handleNavigation = (view) => {
		setActiveView(view);
		const currentDate = new Date(dateStore.currentDate);
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth() + 1; // JS months are 0-based
		const day = currentDate.getDate();
		navigate(`/${view.toLowerCase()}/${year}/${month}/${day}`);
	};
	const handleDateChange = (direction) => {
		if (!activeView) return;

		if (direction === "next") {
			dateStore.next(activeView.toLowerCase());
		} else {
			dateStore.prev(activeView.toLowerCase());
		}

		const newDate = new Date(dateStore.currentDate);
		const year = newDate.getFullYear();
		const month = newDate.getMonth() + 1; // Months are 0-based
		const day = newDate.getDate();

		navigate(`/${activeView.toLowerCase()}/${year}/${month}/${day}`);
	};

	// useEffect(() => {
	// 	setActiveView(getActiveViewFromPath());
	// }, [location.pathname, getActiveViewFromPath]);

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
	const handleCreateEvent = () => {
        setNewEvent({
            title: "",
            start: new Date(), // Set to current date/time
            end: new Date(new Date().getTime() + 60 * 60 * 1000), // Set to one hour later
            description: "",
            location: "",
            participants: [],
            color: "#34ebc6",
        });
        setShowModal(true);
    };

    const handleSave = async (calendarId) => {
        if (newEvent.title) {
            await eventStore.createEvent(newEvent, calendarId);
            setShowModal(false);
            setNewEvent({
                title: "",
                start: null,
                end: null,
                description: "",
                location: "",
                participants: [],
                color: "#000000",
            });
        }
    };

	return (
		<div className='flex items-center justify-between w-full p-2 text-black bg-purple-200 shadow-md gradient'>
			<h1 className='hidden ml-4 text-2xl font-bold sm:block text-gradient'>
				<Link to='/' onClick={() => {handleNavigation('Year')}}>CloOk</Link>
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

				<button className='header-btn' onClick={() => {
					dateStore.today();
					dateStore.updateIsToday();
				}}>
					Today
				</button>
				<button className='header-btn' onClick={() => handleDateChange("prev")}>
					<IoChevronBack size={18} />
				</button>

				<button className='header-btn' onClick={() => handleDateChange("next")}>
					<IoChevronForward size={18} />
				</button>
				<button className='header-btn' onClick={handleCreateEvent}>
					Create event
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
			{showModal && (
                <EventModal
                    event={newEvent}
                    setNewEvent={setNewEvent}
                    handleSave={handleSave}
                    setShowModal={setShowModal}
                    updating={false} // Since this is a new event
                />
            )}
		</div>
	);
});

export default Header;
