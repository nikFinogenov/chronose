import React, { useState } from 'react';
import { calendarStore } from '../store/calendarStore';
import { userStore } from '../store/userStore';

const CalendarModal = ({ isOpen, onClose }) => {
	const [calendarName, setCalendarName] = useState('');
	const [calendarDescription, setCalendarDescription] = useState('');
	const [calendarColor, setCalendarColor] = useState('#ffffff');

	const handleCreateCalendar = () => {
		if (calendarName.trim()) {
			calendarStore.newCalendar(calendarName, calendarDescription, calendarColor, userStore.user.id);
			onClose();
			setCalendarName('');
			setCalendarDescription('');
			setCalendarColor('#ffffff');
		}
	};

	return (
		isOpen && (
			<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
				<div className='p-6 bg-white rounded-lg shadow-lg w-80'>
					<div className="flex justify-between">
						<h2 className='mb-4 text-lg font-semibold'>Create New Calendar</h2>
						<input
							type="color"
							id='color-input'
							value={calendarColor}
							onChange={(e) => setCalendarColor(e.target.value)}
							className=""
							style={{ backgroundColor: calendarColor }}
						/>
					</div>
					<input
						type='text'
						value={calendarName}
						onChange={e => setCalendarName(e.target.value)}
						className='w-full p-2 mb-4 border rounded'
						placeholder='Calendar name'
					/>
					<textarea
						value={calendarDescription}
						onChange={e => setCalendarDescription(e.target.value)}
						className='w-full p-2 mb-4 border rounded'
						placeholder='Calendar description'
					/>

					<div className='flex justify-end space-x-2'>
						<button onClick={onClose} className='text-gray-600 hover:text-gray-900'>
							Cancel
						</button>
						<button onClick={handleCreateCalendar} className='px-4 py-2 text-white rounded bg-primary'>
							Create
						</button>
					</div>
				</div>
			</div>
		)
	);
};

export default CalendarModal;
