import { makeAutoObservable, action, runInAction } from 'mobx';
import { api } from '../services';
import { getCalendarEvents, getEventUsers } from '../services/eventService';
import { joinEvent, inviteUser } from '../services/eventService';
import { getSharedEvents } from '../services/userService';
import { calendarStore } from './calendarStore';

class EventStore {
	eventsByCalendar = {}; // Store events grouped by calendarId

	events = [];

	constructor() {
		makeAutoObservable(this, {
			loadEventsForCalendar: action,
			createEvent: action,
			updateEvent: action,
			deleteEvent: action,
		});
	}

	async loadEventsForCalendar(calendarId, start, end, allDay = false) {
		if (!calendarId) return;

		try {
			const response = await getCalendarEvents(calendarId, start, end);
			const usersMap = new Map();

			// Загружаем участников для всех событий этого календаря
			for (const event of response) {
				const eventUsers = await getEventUsers(event.id);
				usersMap.set(
					event.id,
					eventUsers.map(user => ({ email: user.email, role: user.role }))
				);
			}
			// Преобразуем данные перед сохранением
			const transformedEvents = response.map(event => ({
				...event,
				invitedParticipants: usersMap.get(event.id) || [],
				start: new Date(event.startDate),
				end: new Date(event.endDate),
				calendarId: calendarId,
				allDay: !allDay ? (event.startDate === event.endDate ? true : false) : true,
			}));

			// Сохраняем события в хранилище
			this.setEvents(calendarId, transformedEvents);
		} catch (error) {
			console.error('Failed to load events:', error);
			this.setEvents(calendarId, []);
		}
	}

	async loadInvitedEventsForCalendar(calendarId, userId, allDay = false) {
		if (!calendarId || !userId) return;

		try {
			const response = await getSharedEvents(userId);
			const existingEvents = this.eventsByCalendar[calendarId] || [];
			const usersMap = new Map();

			// Загружаем участников для всех событий
			for (const event of response) {
				const eventUsers = await getEventUsers(event.id);
				usersMap.set(
					event.id,
					eventUsers.map(user => ({ email: user.email, role: user.role }))
				);
			}

			// Преобразуем события перед сохранением
			const transformedEvents = response.map(event => ({
				...event,
				invitedParticipants: usersMap.get(event.id) || [],
				start: new Date(event.startDate),
				end: new Date(event.endDate),
				calendarId: calendarId,
				allDay: allDay || event.startDate === event.endDate,
			}));

			// Фильтруем, исключая уже загруженные события
			const newEvents = transformedEvents.filter(newEvent => !existingEvents.some(existingEvent => existingEvent.id === newEvent.id));

			// Добавляем только новые события
			if (newEvents.length > 0) {
				this.setEvents(calendarId, [...existingEvents, ...newEvents]);
			}
		} catch (error) {
			console.error('Error loading invited events:', error);
			this.setEvents(calendarId, []);
		}
	}

	async createEvent(event, selectedCalendar, repeat) {
		try {
			let response;
			if (repeat) {
				response = await api.post(`/events/calendar/repeat/${selectedCalendar}`, event);
			} else {
				response = await api.post(`/events/calendar/${selectedCalendar}`, event);
			}

			if (response.status === 201) {
				const createdEvent = {
					...response.data.event,
					start: response.data.event.startDate,
					end: response.data.event.endDate,
					allDay: response.data.event.startDate === response.data.event.endDate,
					calendarId: selectedCalendar,
				};

				this.setEvents(selectedCalendar, [...(this.eventsByCalendar[selectedCalendar] || []), createdEvent]);

				// Если у события есть участники, пригласить их
				if (event.participants && event.participants.length > 0) {
					for (const { email, role } of event.participants) {
						try {
							await this.inviteUser(createdEvent.id, email, role);
							console.log(`User ${email} invited as ${role} to event ${createdEvent.id}`);
						} catch (error) {
							console.error(`Failed to invite ${email} as ${role}:`, error);
						}
					}
				}

				return createdEvent;
			}
		} catch (error) {
			console.log('Failed to create event:', error);
			throw error;
		}
	}

	async updateEvent(eventUpdate, calendarId) {
		try {
			const response = await api.patch(`/events/${eventUpdate.id}`, eventUpdate);

			if (response.status === 200) {
				this.setEvents(
					calendarId,
					(this.eventsByCalendar[calendarId] || []).map(event =>
						event.id === eventUpdate.id ? { ...event, ...eventUpdate, allDay: eventUpdate.start === eventUpdate.end } : event
					)
				);
			}
		} catch (error) {
			console.log('Failed to update event:', error);
		}
	}

	async deleteEvent(eventId, calendarId) {
		try {
			const response = await api.delete(`/events/${eventId}`);

			if (response.status === 200) {
				this.setEvents(
					calendarId,
					(this.eventsByCalendar[calendarId] || []).filter(event => event.id !== eventId)
				);
			}
		} catch (error) {
			console.log('Failed to delete event:', error);
		}
	}

	setEvents(calendarId, eventsData) {
		this.eventsByCalendar = {
			...this.eventsByCalendar,
			[calendarId]: eventsData,
		};
	}

	getEventCalendarId(eventId) {
		let calendarId = null;

		Object.keys(eventStore.eventsByCalendar).forEach(key => {
			if (eventStore.eventsByCalendar[key].some(e => e.id === eventId)) {
				calendarId = key;
			}
		});

		return calendarId;
	}

	getEvents(calendarId) {
		return this.eventsByCalendar[calendarId] || [];
	}

	// getEvents() {
	//     // Collect all events from all calendars
	//     return Object.values(this.eventsByCalendar).flat();
	// }
	async loadEventsForAllCalendars(currentDate) {
		const endOfDay = new Date(currentDate);
		endOfDay.setUTCHours(23, 59, 0, 0);

		const allCalendars = [...calendarStore.calendars.filter(calendar => calendar.isActive), ...calendarStore.invitedCalendars.filter(calendar => calendar.isActive)];

		for (const calendar of allCalendars) {
			await this.loadEventsForCalendar(calendar.id, currentDate, endOfDay.toISOString());
		}
	}

	clearEvents() {
		this.eventsByCalendar = {};
	}

	async joinEvent(inviteToken) {
		try {
			const event = await joinEvent(inviteToken);
			runInAction(() => {
				console.log('Joined event:', event);
			});
			return event;
		} catch (error) {
			console.error('Failed to join event:', error);
			throw error;
		}
	}

	async inviteUser(eventId, email, role) {
		try {
			await inviteUser(eventId, email, role);
			console.log(`User ${email} invited as ${role} to event ${eventId}`);
		} catch (error) {
			console.error('Failed to invite user:', error);
		}
	}
}

export const eventStore = new EventStore();
