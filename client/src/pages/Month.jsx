// components/Month.jsx
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // Month view plugin
import interactionPlugin from '@fullcalendar/interaction'; // Allow selecting/editing
import { observer } from 'mobx-react-lite';
import Sidebar from '../components/Sidebar';
import { dateStore } from '../store/dateStore';
import EventModal from '../components/EventModal';
import EventDetails from '../components/EventDetails';
import { calendarStore } from '../store/calendarStore';
import { userStore } from '../store/userStore';
import Swal from 'sweetalert2';
import { eventStore } from '../store/eventStore';

const Month = observer(() => {
	const [showModal, setShowModal] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [updating, setUpdating] = useState(false);
	const [newEvent, setNewEvent] = useState({
		title: '',
		start: null,
		end: null,
		description: '',
		location: '',
		participants: [],
		color: '#34ebc6',
	});

	const handleCloseEventDetails = () => {
		setSelectedEvent(null);
	};

	const handleEditEvent = event => {
		setUpdating(true);
		setNewEvent(event);
		setShowModal(true);
		setSelectedEvent(null);
	};

	// Fetch events when the component mounts or when calendars change
	// useEffect(() => {
	//     const fetchEvents = async () => {
	//         const endOfDay = new Date(dateStore.currentDate);
	//         endOfDay.setHours(23, 59, 0, 0);
	//         const startOfDay = new Date(dateStore.currentDate);
	//         startOfDay.setHours(0, 0, 0, 0);

	//         console.log(dateStore.currentDate);
	//         for (const calendar of calendarStore.calendars) {
	//             if (calendar.isActive) {
	//                 await eventStore.loadEventsForCalendar(calendar.id, startOfDay.toISOString(), endOfDay.toISOString());
	//             }
	//         }
	//         for (const calendar of calendarStore.invitedCalendars) {
	//             if (calendar.isActive) {
	//                 await eventStore.loadEventsForCalendar(calendar.id, startOfDay.toISOString(), endOfDay.toISOString());
	//             }
	//         }
	//     };

	//     fetchEvents();
	// }, [dateStore.currentDate, calendarStore.calendars]); //eslint-disable-line

	useEffect(() => {
		const fetchEvents = async () => {
			const now = new Date(dateStore.currentDate); // Current date

			// Get the first day of the current month at 00:00
			const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
			startOfMonth.setHours(0, 0, 0, 0);

			// Get the last day of the current month at 23:59
			const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
			endOfMonth.setHours(23, 59, 59, 999);

			console.log(`Fetching events from ${startOfMonth.toISOString()} to ${endOfMonth.toISOString()}`);

			// Fetch events for all active calendars
			for (const calendar of [...calendarStore.calendars, ...calendarStore.invitedCalendars]) {
				if (calendar.isActive) {
					await eventStore.loadEventsForCalendar(calendar.id, startOfMonth.toISOString(), endOfMonth.toISOString());
				}
			}
		};

		fetchEvents();
	}, [dateStore.currentDate, calendarStore.calendars]); //eslint-disable-line

	const handleSelect = selectionInfo => {
		if (!localStorage.getItem('token')) {
			if (!calendarStore.calendars.length) {
				Swal.fire({
					title: 'Sorry...',
					text: 'Login to create events',
					icon: 'error',
					confirmButtonText: 'Ok',
				});
				return;
			}

			return;
		}

		if (userStore.user && !userStore.user.isEmailConfirmed) {
			Swal.fire({
				text: 'Confirm your email first',
				icon: 'warning',
				confirmButtonText: 'Ok',
			});
			return;
		}

		setNewEvent({
			title: '',
			start: selectionInfo.start,
			end: selectionInfo.end,
			description: '',
			location: '',
			participants: [],
			color: '#34ebc6',
		});
		setShowModal(true);
	};

	const handleSave = async calendarId => {
		if (newEvent.title) {
			if (updating) {
				await eventStore.updateEvent(newEvent, calendarId);
				if (newEvent.calendarId && newEvent.participants.length > 0) {
					for (const { email, role } of newEvent.participants) {
						try {
							await eventStore.inviteUser(newEvent.id, email, role);
							console.log(`User ${email} invited as ${role} to event ${newEvent.id}`);
						} catch (error) {
							console.error(`Failed to invite ${email} as ${role}:`, error);
						}
					}
				}
			} else {
				await eventStore.createEvent(newEvent, calendarId);
			}
			setShowModal(false);
			setNewEvent({
				title: '',
				start: null,
				end: null,
				description: '',
				location: '',
				participants: [],
				color: '#000000',
			});
		}
	};

	const handleDeleteEvent = async eventId => {
		const calendarId = eventStore.getEventCalendarId(eventId);
		if (calendarId) {
			await eventStore.deleteEvent(eventId, calendarId);
			setSelectedEvent(null);
		}
	};

	const handleEventClick = clickInfo => {
		const event = clickInfo.event;
		setSelectedEvent({
			id: event.id,
			title: event.title,
			start: event.start,
			end: event.end,
			description: event.extendedProps.description || '',
			location: event.extendedProps.location || '',
			participants: event.extendedProps.participants || [],
			color: event.backgroundColor || '#000000',
			calendarId: event.extendedProps.calendarId || 'Unknown',
			type: event.extendedProps.type,
		});
	};

	const handleEventChange = async changeInfo => {
		await eventStore.updateEvent(
			{
				id: changeInfo.event.id,
				start: changeInfo.event.start,
				end: changeInfo.event.end,
			},
			eventStore.getEventCalendarId(changeInfo.event.id)
		);
	};

	useEffect(() => {
		const fetchEvents = async () => {
			const now = new Date(dateStore.currentDate); // Current date

			// Get the first day of the current month
			const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
			startOfMonth.setHours(0, 0, 0, 0); // Set to 00:00

			// Get the last day of the current month
			const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
			endOfMonth.setHours(23, 59, 59, 999); // Set to 23:59

			// Convert to ISO format
			const startOfMonthISO = startOfMonth.toISOString();
			const endOfMonthISO = endOfMonth.toISOString();

			console.log(`Fetching events from ${startOfMonthISO} to ${endOfMonthISO}`);

			// Fetch events for active calendars
			for (const calendar of calendarStore.calendars) {
				if (calendar.isActive) {
					await eventStore.loadEventsForCalendar(calendar.id, startOfMonthISO, endOfMonthISO);
				}
			}
			//TODO await eventStore.loadInvitedEventsForCalendar(calendarStore?.calendars[0]?.id, userStore.user.id);
			// Fetch events for active invited calendars
			for (const calendar of calendarStore.invitedCalendars) {
				if (calendar.isActive) {
					await eventStore.loadEventsForCalendar(calendar.id, startOfMonthISO, endOfMonthISO);
				}
			}
		};

		fetchEvents();
	}, [dateStore.currentDate, calendarStore.calendars]);

	return (
		<div className='flex w-full px-4 mt-4'>
			<Sidebar />
			<div className='w-full'>
				<h1 className='mb-5 text-3xl'>
					{new Date(dateStore.currentDate).toLocaleString('default', { month: 'long' }) + ' ' + new Date(dateStore.currentDate).getFullYear()}
				</h1>

				{/* FullCalendar with Month View */}
				<FullCalendar
					key={new Date(dateStore.currentDate)} // Ensures re-render on date change
					plugins={[dayGridPlugin, interactionPlugin]} // Use dayGrid for month view
					initialDate={new Date(dateStore.currentDate)}
					initialView='dayGridMonth' // Show month instead of week
					selectable={true}
					editable={true}
					events={calendarStore.calendars
						.filter(calendar => calendar.isActive)
						.flatMap(calendar =>
							eventStore.getEvents(calendar.id).map(event => ({
								...event,
								borderColor: calendar.color, // Match border color
								classNames: ['left-border-event', 'pading-left'], // Custom classes
							}))
						)}
					select={handleSelect}
					dateClick={handleSelect}
					eventChange={handleEventChange}
					eventClick={handleEventClick}
					slotLabelFormat={{
						hour: '2-digit',
						minute: '2-digit',
						hour12: false, // 24-часовой формат
					}}
					height='93%'
					nowIndicator={true} // Highlights the current date
					headerToolbar={{
						left: '',
						center: '',
						right: '', // Disable week/day switching
					}}
				/>
			</div>
		</div>
	);
});

export default Month;
