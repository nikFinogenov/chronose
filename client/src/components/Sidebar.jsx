import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import MicroMonth from './MicroMonth';
import { dateStore } from '../store/dateStore';
import { userStore } from '../store/userStore';
import { calendarStore } from '../store/calendarStore';
import { CiSquarePlus } from 'react-icons/ci';
import { BsThreeDotsVertical } from 'react-icons/bs';
import CalendarModal from './CalendarModal';

const Sidebar = observer(() => {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
	const [selectedCalendar, setSelectedCalendar] = useState(null);
	const [hoveredCalendar, setHoveredCalendar] = useState(null); // For showing three dots on hover
	const [inviteEmail, setInviteEmail] = useState('');
	const [inviteRole, setInviteRole] = useState('viewer');
	const [calendarColor, setCalendarColor] = useState('#ffffff');

	useEffect(() => {
		async function fetchCalendars() {
			if (userStore.user) {
				await calendarStore.loadCalendars(userStore.user.id);
				await calendarStore.loadInvitedCalendars(userStore.user.id);
			}
		}
		fetchCalendars();
	}, []);

	const isValidEmail = email => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	};

	const handleIsActiveChange = (calendar, value) => {
		runInAction(() => {
			calendar.isActive = value; // Update MobX state directly
		});

		// Update localStorage for isActive state
		const storedVisibility = JSON.parse(localStorage.getItem('calendarVisibility')) || {};
		storedVisibility[calendar.id] = value;
		localStorage.setItem('calendarVisibility', JSON.stringify(storedVisibility));
	};

	const openSettingsModal = calendar => {
		setSelectedCalendar(calendar);
		setIsSettingsModalOpen(true);
	};

	return (
		<div className='min-h-screen p-4 border-r border-gray-300 bg-base-100'>
			<p className='hidden'>{userStore.user?.id ? '' : ''}</p>
			<div className='mb-4 text-lg font-semibold'>Today is {new Date(dateStore.currentDate).toLocaleDateString()}</div>

			<MicroMonth />

			<div className='w-full mt-4 join join-vertical bg-base-100'>
				<div className='border collapse collapse-arrow join-item border-base-300'>
					<input type='checkbox' defaultChecked />
					<div className='z-10 flex items-center justify-between font-semibold collapse-title'>
						<span>My calendars</span>
						<button onClick={() => setIsCreateModalOpen(true)} className='p-1 text-2xl transition rounded-lg hover:bg-gray-200'>
							<CiSquarePlus />
						</button>
					</div>
					<div className='space-y-2 text-sm collapse-content'>
						{calendarStore.calendars?.length > 0 ? (
							calendarStore.calendars.map(calendar => (
								<div
									key={calendar.id}
									className='flex items-center justify-between px-2 py-1 rounded group'
									onMouseEnter={() => setHoveredCalendar(calendar.id)}
									onMouseLeave={() => setHoveredCalendar(null)}
								>
									<label className='flex items-center flex-1 gap-2 overflow-hidden whitespace-nowrap'>
										<input
											type='checkbox'
											className='checkbox'
											style={{
												accentColor: calendar.color, // Change checkbox color
												borderColor: calendar.color, // Change checkbox border
												'--chkbg': calendar.color,
											}}
											checked={calendar.isActive}
											onChange={e => handleIsActiveChange(calendar, e.target.checked)}
										/>
										<span className='truncate'>{calendar.name}</span>
									</label>
									{hoveredCalendar === calendar.id && (
										<button
											onClick={() => openSettingsModal(calendar)}
											className='p-1 text-gray-600 transition-opacity rounded-lg opacity-0 hover:text-gray-900 group-hover:opacity-100'
										>
											<BsThreeDotsVertical />
										</button>
									)}
								</div>
							))
						) : (
							<p className='text-gray-500'>No calendars found</p>
						)}
					</div>
				</div>

				<div className='border collapse collapse-arrow join-item border-base-300'>
					<input type='checkbox' />
					<div className='font-semibold collapse-title'>Other calendars</div>
					<div className='space-y-2 text-sm text-gray-500 collapse-content'>
						{calendarStore.invitedCalendars?.length > 0 ? (
							calendarStore.invitedCalendars.map(calendar => (
								<div key={calendar.id} className='flex items-center justify-between px-2 py-1 rounded group'>
									<label className='flex items-center flex-1 gap-2 overflow-hidden whitespace-nowrap'>
										{/* <input type='checkbox' className='checkbox checkbox-primary' /> */}
										<input
											type='checkbox'
											className='checkbox checkbox-primary'
											checked={calendar.isActive}
											onChange={e => handleIsActiveChange(calendar, e.target.checked)}
										/>
										<span className='truncate'>{calendar.name}</span>
									</label>
									<button
										onClick={() => openSettingsModal(calendar)}
										className='p-1 text-gray-600 transition-opacity rounded-lg opacity-0 hover:text-gray-900 group-hover:opacity-100'
									>
										<BsThreeDotsVertical />
									</button>
								</div>
							))
						) : (
							<p>No additional calendars available.</p>
						)}
					</div>
				</div>
			</div>

			{/* Create Calendar Modal */}
			<CalendarModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
			/>

			{/* Calendar Settings Modal */}
			{isSettingsModalOpen && selectedCalendar && (
				<div className='fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-50'>
					<div className='p-6 bg-white rounded-lg shadow-lg w-[90%] max-w-sm'>
						<div className='flex justify-between'>
							<h2 className='mb-4 text-lg font-semibold'>Calendar Settings</h2>
							<input
								type="color"
								id='color-input'
								value={selectedCalendar.color}
								onChange={(e) => setSelectedCalendar({ ...selectedCalendar, color: e.target.value })}
								className=""
								style={{ backgroundColor: selectedCalendar.color }}
							/>
						</div>
						<input
							type='text'
							value={selectedCalendar.name}
							onChange={e => setSelectedCalendar({ ...selectedCalendar, name: e.target.value })}
							className='w-full p-2 mb-4 border rounded'
							placeholder='Calendar name'
						/>

						{/* Invite User */}
						<h3 className='mb-2 font-semibold text-md'>Invite User</h3>
						<input
							type='email'
							placeholder='Enter email'
							value={inviteEmail}
							onChange={e => setInviteEmail(e.target.value)}
							className='w-full p-2 mb-2 border rounded'
						/>

						{/* Чекбоксы для выбора роли */}
						<div className='flex flex-wrap gap-2 mb-4'>
							<label className='flex items-center'>
								<input type='checkbox' checked={inviteRole === 'editor'} onChange={() => setInviteRole('editor')} className='mr-2 checkbox checkbox-primary' />
								Editor
							</label>
							<label className='flex items-center'>
								<input type='checkbox' checked={inviteRole === 'viewer'} onChange={() => setInviteRole('viewer')} className='mr-2 checkbox checkbox-primary' />
								Viewer
							</label>
							<label className='flex items-center'>
								<input type='checkbox' checked={inviteRole === 'manager'} onChange={() => setInviteRole('manager')} className='mr-2 checkbox checkbox-primary' />
								Manager
							</label>
						</div>

						<button
							onClick={() => {
								if (isValidEmail(inviteEmail)) {
									calendarStore.inviteUser(selectedCalendar.id, inviteEmail, inviteRole);
									setInviteEmail('');
								}
							}}
							disabled={!isValidEmail(inviteEmail)} // Disable button if email is invalid
							className={`w-full px-4 py-2 text-white rounded ${isValidEmail(inviteEmail) ? 'bg-primary' : 'bg-gray-500'}`}
						>
							Invite
						</button>

						{/* Save buttons */}
						<div className='flex justify-end mt-4 space-x-2'>
							<button onClick={() => setIsSettingsModalOpen(false)} className='text-gray-600 hover:text-gray-900'>
								Cancel
							</button>
							<button
								onClick={() => {
									calendarStore.updateCalendar(selectedCalendar);
									setIsSettingsModalOpen(false);
								}}
								className='px-4 py-2 text-white rounded bg-primary'
							>
								Save
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
});

export default Sidebar;
