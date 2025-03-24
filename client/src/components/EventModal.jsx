import React, { useState, useEffect } from 'react';
import { calendarStore } from '../store/calendarStore';
import { eventStore } from '../store/eventStore';

const EventModal = ({ event, setNewEvent, handleSave, setShowModal, updating = false }) => {
    const [participantsInput, setParticipantsInput] = useState("");
    const [selectedCalendar, setSelectedCalendar] = useState(event.calendarId || (calendarStore.calendars.length > 0 ? calendarStore.calendars[0].id : null));

	useEffect(() => {
		if (calendarStore.calendars.length === 1) {
			setSelectedCalendar(calendarStore.calendars[0].id);
		}
	}, []);

	const handleCalendarChange = e => {
		const calendarId = e.target.value;
		setSelectedCalendar(calendarId);
	};

	const isValidEmail = email => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	};

	const handleAddParticipant = e => {
		if (e.key === 'Enter') {
			const email = participantsInput.trim();
			if (isValidEmail(email)) {
				setNewEvent({
					...event,
					participants: [...event.participants, { email, role: 'viewer' }],
				});
				setParticipantsInput('');
			}
		}
	};

	const handleDeleteParticipant = email => {
		setNewEvent({
			...event,
			participants: event.participants.filter(participant => participant.email !== email),
		});
	};

	const handleRoleChange = (email, newRole) => {
		setNewEvent({
			...event,
			participants: event.participants.map(participant => (participant.email === email ? { ...participant, role: newRole } : participant)),
		});
	};

	const handleColorChange = e => {
		setNewEvent({ ...event, color: e.target.value });
	};

	// TODO
	const handleSubmit = async () => {
		if (!event.title || event.title === '') return;

		setShowModal(false);
		handleSave(selectedCalendar);
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50'>
			<div className='p-6 bg-white rounded-lg shadow-lg w-96'>
				<h2 className='mb-4 text-lg font-bold'>{updating ? 'Edit Event' : 'Create New Event'}</h2>

				{/* Calendar Selection */}
				{!updating && calendarStore.calendars.length > 1 && (
					<div className='mb-3'>
						<label className='block text-sm font-medium text-gray-700'>Select Calendar:</label>
						<select className='w-full p-2 border' value={selectedCalendar || ''} onChange={handleCalendarChange}>
							<option value='' disabled>
								Select a calendar
							</option>
							{calendarStore.calendars.map(calendar => (
								<option key={calendar.id} value={calendar.id}>
									{calendar.name}
								</option>
							))}
						</select>
					</div>
				)}

				{/* Event Title */}
				<input
					type='text'
					placeholder='Event Title'
					className='border p-1.5 w-full mb-3'
					value={event.title}
					onChange={e => setNewEvent({ ...event, title: e.target.value })}
				/>

				{/* Event Type Selection */}
				<div className='mb-3'>
					<label className='block text-sm font-medium text-gray-700'>Event Type:</label>
					<select className='border p-1.5 w-full' value={event.type || 'event'} onChange={e => setNewEvent({ ...event, type: e.target.value })}>
						<option value='event'>Event</option>
						<option value='task'>Task</option>
						<option value='reminder'>Reminder</option>
					</select>
				</div>

				{/* Event Description */}
				<textarea
					placeholder='Event Description'
					className='border p-1.5 w-full mb-3'
					value={event.description || ''}
					onChange={e => setNewEvent({ ...event, description: e.target.value })}
				/>

				{/* Start Date */}
				<label className='block text-sm font-medium text-gray-700'>Start Date & Time:</label>
				<input
					type='datetime-local'
					className='border p-1.5 w-full mb-3'
					value={event.start ? new Date(event.start).toISOString().slice(0, 16) : ''}
					onChange={e => setNewEvent({ ...event, start: new Date(e.target.value) })}
				/>

				{/* End Date */}
				<label className='block text-sm font-medium text-gray-700'>End Date & Time:</label>
				<input
					type='datetime-local'
					className='border p-1.5 w-full mb-3'
					value={event.end ? new Date(event.end).toISOString().slice(0, 16) : ''}
					onChange={e => setNewEvent({ ...event, end: new Date(e.target.value) })}
				/>

				{/* Participants */}
				<div className='mb-3'>
					<input
						type='text'
						placeholder='Add participant email'
						className='border p-1.5 w-full mb-2'
						value={participantsInput}
						onChange={e => setParticipantsInput(e.target.value)}
						onKeyDown={handleAddParticipant}
					/>
					<div>
						{event.participants.map((participant, index) => (
							<div key={index} className='flex items-center justify-between mb-2'>
								<span className='px-2 py-1 text-sm text-gray-700 bg-gray-200 rounded-full'>{participant.email}</span>
								<select className='p-1 border rounded' value={participant.role} onChange={e => handleRoleChange(participant.email, e.target.value)}>
									<option value='editor'>Editor</option>
									<option value='viewer'>Viewer</option>
									<option value='manager'>Manager</option>
								</select>
								<button className='text-red-500' onClick={() => handleDeleteParticipant(participant.email)}>
									&#10005;
								</button>
							</div>
						))}
					</div>
				</div>

                {/* Event Color */}
                <div className="mb-4">
                    <input
                        type="color"
                        id='color-input'
                        className=""
                        value={event.color}
                        onChange={handleColorChange}
                        style={{ backgroundColor: event.color }}
                    />
                </div>


                {/* Action Buttons */}
                <div className="flex justify-end space-x-5">
                    <button
                        className="px-4 py-1 bg-gray-300 rounded"
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-1 bg-blue-500 text-white rounded"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
