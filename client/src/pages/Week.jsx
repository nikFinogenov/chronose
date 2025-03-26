import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Sidebar from '../components/Sidebar';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { dateStore } from '../store/dateStore';
import EventModal from '../components/EventModal';
import EventDetails from '../components/EventDetails';
import { calendarStore } from '../store/calendarStore';
import { userStore } from '../store/userStore';
import Swal from 'sweetalert2';
import { eventStore } from '../store/eventStore';

const Week = observer(() => {
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
	const getTimezoneOffset = () => {
		const now = new Date();
		const offset = -now.getTimezoneOffset() / 60; // Convert minutes to hours
		const formattedOffset = `GMT${offset >= 0 ? `+${offset}` : offset}`;
		return formattedOffset;
		// setTimezoneOffset(formattedOffset);
	};

	// useEffect(() => {
	//     const fetchEvents = async () => {
	//         const now = new Date(dateStore.currentDate);
	//         const timeZoneOffset = now.getTimezoneOffset() * 60000; // Convert minutes to milliseconds

	//         // Get Monday of the current week (start of week)
	//         const startOfWeek = new Date(now);
	//         startOfWeek.setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 6) % 7)); // Move to Monday
	//         startOfWeek.setUTCHours(0, 0, 0, 0); // Set to 00:00

	//         // Get Sunday of the current week (end of week)
	//         const endOfWeek = new Date(startOfWeek);
	//         endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6); // Move to Sunday
	//         endOfWeek.setUTCHours(23, 59, 59, 999); // Set to 23:59

	//         // Adjust for time zone
	//         const startOfWeekISO = new Date(startOfWeek.getTime() - timeZoneOffset).toISOString();
	//         const endOfWeekISO = new Date(endOfWeek.getTime() - timeZoneOffset).toISOString();

	//         console.log(`Fetching events from ${startOfWeekISO} to ${endOfWeekISO}`);

	//         for (const calendar of calendarStore.calendars) {
	//             if (calendar.isActive) {
	//                 await eventStore.loadEventsForCalendar(calendar.id, startOfWeekISO, endOfWeekISO);
	//             }
	//         }
	//         for (const calendar of calendarStore.invitedCalendars) {
	//             if (calendar.isActive) {
	//                 await eventStore.loadEventsForCalendar(calendar.id, startOfWeekISO, endOfWeekISO);
	//             }
	//         }
	//     };

	//     fetchEvents();
	// }, [dateStore.currentDate, calendarStore.calendars]); //eslint-disable-line

	useEffect(() => {
		const fetchEvents = async () => {
			const now = new Date(dateStore.currentDate); // Current date

			// Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
			const currentDay = now.getDay();

			// Adjust to get Monday of the current week
			const startOfWeek = new Date(now);
			startOfWeek.setDate(now.getDate() - (currentDay === 0 ? 6 : currentDay - 1)); // If Sunday, go back 6 days; else, adjust to Monday
			startOfWeek.setHours(0, 0, 0, 0); // Set to 00:00

			// Get Sunday of the current week
			const endOfWeek = new Date(startOfWeek);
			endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to Sunday
			endOfWeek.setHours(23, 59, 59, 999); // Set to 23:59

			// Convert to ISO format
			const startOfWeekISO = startOfWeek.toISOString();
			const endOfWeekISO = endOfWeek.toISOString();

			console.log(`Fetching events from ${startOfWeekISO} to ${endOfWeekISO}`);

			for (const calendar of calendarStore.calendars) {
				if (calendar.isActive) {
					await eventStore.loadEventsForCalendar(calendar.id, startOfWeekISO, endOfWeekISO);
				}
			}
			await eventStore.loadInvitedEventsForCalendar(calendarStore?.calendars[0]?.id, userStore.user.id);
			for (const calendar of calendarStore.invitedCalendars) {
				if (calendar.isActive) {
					await eventStore.loadEventsForCalendar(calendar.id, startOfWeekISO, endOfWeekISO);
				}
			}
		};

		fetchEvents();
	}, [dateStore.currentDate, calendarStore.calendars]);

	const handleCloseEventDetails = () => {
		setSelectedEvent(null);
	};

	const handleEditEvent = event => {
		setUpdating(true);
		setNewEvent(event);
		setShowModal(true);
		setSelectedEvent(null);
	};

	const getTimezoneOffset = () => {
		const now = new Date();
		const offset = -now.getTimezoneOffset() / 60; // Convert minutes to hours
		const formattedOffset = `GMT${offset >= 0 ? `+${offset}` : offset}`;
		return formattedOffset;
		// setTimezoneOffset(formattedOffset);
	};

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
				await eventStore.updateEvent(newEvent, calendarId);
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

	return (
		<div className='flex p-4 h-max'>
			<Sidebar />
			<div className='w-full'>
				<div className='flex-1'>
					<FullCalendar
						key={new Date(dateStore.currentDate)}
						plugins={[timeGridPlugin, interactionPlugin]}
						initialDate={new Date(dateStore.currentDate)}
						initialView='timeGridWeek' // Неделя вместо дня
						selectable={true}
						editable={true}
						events={[...calendarStore.calendars, ...calendarStore.invitedCalendars]
							.filter(calendar => calendar.isActive)
							.flatMap(calendar =>
								eventStore.getEvents(calendar.id).map(event => ({
									...event,
									borderColor: calendar.color, // Optional: Match border color
									classNames: ['left-border-event', 'pading-left'], // Add custom class
								}))
							)}
						select={handleSelect}
						eventChange={handleEventChange}
						eventClick={handleEventClick}
						height='auto'
						slotLabelFormat={{
							hour: '2-digit',
							minute: '2-digit',
							hour12: false, // 24-часовой формат
						}}
						allDaySlot={true}
						allDayText={getTimezoneOffset()}
						nowIndicator={true} // Убрана красная линия текущего времени
						weekNumbers={false} // Номера недель (можно отключить)
						headerToolbar={{
							left: 'title',
							center: '',
							right: '', // Переключение вида только на неделю
						}}
					/>

					{showModal && <EventModal event={newEvent} setNewEvent={setNewEvent} handleSave={handleSave} setShowModal={setShowModal} updating={updating} />}

					{selectedEvent && <EventDetails event={selectedEvent} onClose={handleCloseEventDetails} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />}
				</div>
			</div>
		</div>
	);
});

export default Week;
