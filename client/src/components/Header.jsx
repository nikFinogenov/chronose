import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { dateStore } from '../store/dateStore';
import { userStore } from '../store/userStore';
import { observer } from 'mobx-react-lite';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { IoChevronBack, IoChevronForward, IoSettingsSharp } from 'react-icons/io5'; // Import settings icon
import EventModal from './EventModal';
import { eventStore } from '../store/eventStore';
import Swal from 'sweetalert2';

const Header = observer(() => {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		setActiveView(getActiveViewFromPath());
	}, [location.pathname]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.ctrlKey && event.key === 't') {
				event.preventDefault(); // Prevent default browser actions
				handleCreateEvent();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	const getActiveViewFromPath = useCallback(() => {
		const path = location.pathname.split('/').filter(Boolean); // Remove leading "/"
		const currentView = path[0];
		const validViews = ['day', 'week', 'month', 'year'];
		return validViews.includes(currentView) ? currentView.charAt(0).toUpperCase() + currentView.slice(1) : 'Year';
	}, [location.pathname]);

	const [activeView, setActiveView] = useState(getActiveViewFromPath());
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showModal, setShowModal] = useState(false); // State for modal
	const [newEvent, setNewEvent] = useState({
		title: '',
		start: null,
		end: null,
		description: '',
		location: '',
		participants: [],
		color: '#34ebc6',
		type: 'reminder',
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

		if (direction === 'next') {
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

	const handleCreateEvent = () => {
		if (!userStore.user) {
			Swal.fire({
				text: 'Login first',
				icon: 'warning',
				confirmButtonText: 'Ok',
			});
		} else {
			setNewEvent({
				title: '',
				start: new Date(), // Set to current date/time
				end: new Date(new Date().getTime() + 60 * 60 * 1000), // Set to one hour later
				description: '',
				location: '',
				participants: [],
				color: '#34ebc6',
				type: 'reminder',
			});
			setShowModal(true);
		}
	};

	const handleSave = async (calendarId, repeat, zoomEnabled, locationEnabled) => {
		if (newEvent.title) {
			await eventStore.createEvent({ ...newEvent, repeatNess: repeat, zoom: zoomEnabled, location: locationEnabled }, calendarId, repeat);
			setShowModal(false);
			setNewEvent({
				title: '',
				start: null,
				end: null,
				description: '',
				location: '',
				participants: [],
				color: '#000000',
				type: 'reminder',
			});
		}
	};

	return (
		<div className='flex items-center justify-between w-full p-2 text-black bg-purple-200 shadow-md gradient'>
			<h1 className='hidden ml-4 text-2xl font-bold sm:block text-gradient'>
				<Link
					to='/'
					onClick={() => {
						handleNavigation('Year');
					}}
				>
					CloOk
				</Link>
			</h1>

			{/* Large Screen Menu */}
			<div className='flex items-center hidden sm:flex'>
				<div className='dropdown dropdown-end'>
					<div
						tabIndex={0}
						role='button'
						className='flex items-center justify-between w-32 header-btn'
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						{activeView}
						{isMenuOpen ? (
							<IoMdArrowDropup size={20} className='pointer-events-none' />
						) : (
							<IoMdArrowDropdown size={20} className='pointer-events-none' />
						)}
					</div>
					{isMenuOpen && (
						<ul
							tabIndex={0}
							className='dropdown-content bg-white border border-[#dadce0] rounded-md shadow-md z-50 w-32 p-2'
						>
							{['Day', 'Week', 'Month', 'Year'].map((view) => (
								<li key={view}>
									<p
										className={`cursor-pointer p-2 rounded ${
											activeView === view ? 'bg-gray-200' : 'hover:bg-gray-100'
										}`}
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

				<button
					className='header-btn'
					onClick={() => {
						dateStore.today();
						dateStore.updateIsToday();
						navigate(`/${activeView.toLowerCase()}`);
					}}
				>
					Today
				</button>
				<button className='header-btn' onClick={() => handleDateChange('prev')}>
					<IoChevronBack size={18} />
				</button>

				<button className='header-btn' onClick={() => handleDateChange('next')}>
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

			{/* Mobile Screen Burger Menu */}
			{/* This panel will only be visible on small screens */}
			<div className='sm:hidden'>
				<button
					className='burger-menu p-2'
					onClick={() => setIsMenuOpen(!isMenuOpen)}
				>
					{/* Add an icon for the burger menu */}
					<span className='block w-6 h-1 bg-black mb-1'></span>
					<span className='block w-6 h-1 bg-black mb-1'></span>
					<span className='block w-6 h-1 bg-black'></span>
				</button>

				{/* Mobile Side Panel */}
{isMenuOpen && (
  <div className='fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-lg p-4 transition-all duration-300 ease-in-out transform'>
    <h2 className='text-xl font-bold mb-4'>Menu</h2>
    {/* All elements for small screens */}
    <div className='flex flex-col'>
      <div className='p-2 mb-4'>
        <p className='font-semibold text-lg mb-2'>Select View</p>
        <select
          className='w-full p-2 border border-[#ec7eea] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec7eea] text-black'
          onChange={(e) => {
            handleNavigation(e.target.value);
            setActiveView(e.target.value); // Ensure activeView state is updated
          }}
          value={activeView} // Ensure the value reflects the current activeView state
        >
          {['Day', 'Week', 'Month', 'Year'].map((view) => (
            <option key={view} value={view.toLowerCase()}>
              {view}
            </option>
          ))}
        </select>
      </div>

      <button
        className='header-btn p-2 mb-2 border border-[#ec7eea] text-black hover:bg-gray-100 focus:outline-none rounded-md'
        onClick={() => dateStore.today()}
      >
        Today
      </button>

      <div className='flex justify-center mb-2 space-x-4'>
        <button
          className='header-btn p-2 border border-[#ec7eea] text-black hover:bg-gray-100 focus:outline-none rounded-md'
          onClick={() => handleDateChange('prev')}
        >
          <IoChevronBack size={18} />
        </button>
        <button
          className='header-btn p-2 border border-[#ec7eea] text-black hover:bg-gray-100 focus:outline-none rounded-md'
          onClick={() => handleDateChange('next')}
        >
          <IoChevronForward size={18} />
        </button>
      </div>

      <button
        className='header-btn p-2 mb-2 border border-[#ec7eea] text-black hover:bg-gray-100 focus:outline-none rounded-md'
        onClick={handleCreateEvent}
      >
        Create event
      </button>

      {userStore.user === null ? (
        <button
          className='header-btn p-2 mb-2 border border-[#ec7eea] text-black hover:bg-gray-100 focus:outline-none rounded-md'
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      ) : (
        <button
          className='header-btn p-2 mb-2 border border-[#ec7eea] text-black hover:bg-gray-100 focus:outline-none rounded-md'
          onClick={() => navigate('/settings')}
        >
          <IoSettingsSharp size={20} />
        </button>
      )}
    </div>
  </div>
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
