
import React, { useEffect, useState } from "react";
import { FaTimes, FaEdit, FaTrash, FaClock, FaCalendarAlt, FaUser } from "react-icons/fa";
import { calendarStore } from "../store/calendarStore";
import { Link } from "react-router";
import { eventStore } from "../store/eventStore";
import { constrainPoint } from '@fullcalendar/core/internal';

const EventDetails = ({ event, onClose, onEdit, onDelete }) => {
	const calendar = calendarStore.calendars.find((cal) => cal.id === event.calendarId);
	const calendar2 = calendarStore.invitedCalendars.find((cal) => cal.id === event.calendarId);
	const calendarName = calendar || calendar2 ? calendar?.name || calendar2?.name : "Unknown Calendar";
	const [showMap, setShowMap] = useState(false); // Control map visibility
	const isZoomLink = event.description?.startsWith("https://us05web.zoom.us");
	const hasNewLine = event.description?.includes('\n');
	const zoomLink = event.description?.split('\n')[0] || "#";
	const [participants, setParticipants] = useState([]);

    useEffect(() => {
        const fetchParticipants = async () => {
            if (event.invitedParticipants?.length > 0) {
                setParticipants(event.invitedParticipants);
            } else if (calendar) {
                const filteredParticipants = calendar.participants.filter(participant => participant.role !== 'owner');
                setParticipants(filteredParticipants);
            } else if (calendar2) {
                // Если календарь приглашённый, получаем пользователей через API
                try {
                    const filteredParticipants = calendar2.participants.filter(participant => participant.role !== 'owner');
                    setParticipants(filteredParticipants);
                } catch (error) {
                    console.error('Failed to load event users:', error);
                }
            } else {
                setParticipants([]);
            }
        };

        fetchParticipants();
    }, [event.id, event.invitedParticipants, calendar, calendar2]);

	useEffect(() => {
		const handleKeyDown = e => {
			if (e.key === 'Backspace') {
				e.preventDefault();
				onDelete(event.id);
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [event.id, onDelete]);

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50'>
			<div className='bg-white p-6 rounded-lg shadow-lg w-[400px] relative'>
				{/* Header Icons */}
				<div className='absolute flex space-x-2 top-3 right-3'>
					<button onClick={() => onEdit(event)} className='text-blue-500 hover:text-blue-700'>
						<FaEdit size={16} />
					</button>
					<button onClick={() => onDelete(event.id)} className='text-red-500 hover:text-red-700'>
						<FaTrash size={16} />
					</button>
					<button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
						<FaTimes size={16} />
					</button>
				</div>

				{/* Main Content */}
				<div className='flex items-center space-x-2'>
					<h3 className='text-lg font-semibold'>{event.title}</h3>
					<span className='w-3 h-3 rounded-full' style={{ backgroundColor: event.color }}></span>
				</div>
				<p className='flex items-center mt-2 text-gray-600'>
					<FaClock className='mr-2 text-gray-500' />
					{new Date(event.start).toLocaleDateString('en-US', {
						weekday: 'long',
						month: 'long',
						day: 'numeric',
					})}{' '}
					{event.allDay && (
						<>
							{new Date(event.start).toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit',
								hour12: false,
							})}{' '}
							-{' '}
							{new Date(event.end).toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit',
								hour12: false,
							})}
						</>
					)}
				</p>
				<p className="text-gray-500 flex items-center mt-2">
					<FaCalendarAlt className="mr-2 text-gray-500" />
					{calendarName}
				</p>
				<div className='mt-4'>
					<h4 className='font-semibold text-md'>Participants</h4>
					{participants?.length > 0 ? (
						<ul className='mt-2 space-y-2'>
							{participants.map((participant, index) => (
								<li key={index} className='flex items-center justify-between p-2 border rounded'>
									<div className='flex items-center space-x-2'>
										<FaUser className='text-gray-500' />
										<span className='text-gray-700'>{participant.email}</span>
									</div>
									<span className='px-2 py-1 text-sm bg-gray-200 rounded'>{participant.role}</span>
								</li>
							))}
						</ul>
					) : (
						<p className='mt-2 text-gray-500'>No participants yet.</p>
					)}
				</div>
				{event.type === 'arrangement' && event.description ? (
					<div>
						{isZoomLink && (
							<a href={zoomLink} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
								Link to Zoom
							</a>
						)}
						{hasNewLine || !isZoomLink ? (
							<p className="text-blue-500 cursor-pointer text-sm mt-1" onClick={() => setShowMap(true)}>
								Show on map
							</p>
						) : null}
					</div>
				) : (
					<p>{event.description}</p>
				)}
				{showMap && (
					<div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
						<div className="bg-white p-6 rounded-lg shadow-lg w-[800px] h-[650px] relative">
							<button
								className="absolute top-2 right-2 text-gray-700"
								onClick={() => setShowMap(false)}
							>
								✖
							</button>
							<iframe
								width="100%"
								height="100%"
								loading="lazy"
								allowFullScreen
								referrerPolicy="no-referrer-when-downgrade"
								src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API}&q=${encodeURIComponent(event.description.includes('\n') ? event.description.split('\n')[1] : event.description)}`}
							></iframe>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default EventDetails;
