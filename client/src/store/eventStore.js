import { makeAutoObservable, action } from "mobx";
import { api } from "../services";
import { getCalendarEvents } from "../services/eventService";


class EventStore {
    eventsByCalendar = {}; // Store events grouped by calendarId

    constructor() {
        makeAutoObservable(this, {
            loadEventsForCalendar: action,
            createEvent: action,
            updateEvent: action,
            deleteEvent: action,
        });
    }

    async loadEventsForCalendar(calendarId) {
        if (!calendarId) return;

        try {
            const response = await getCalendarEvents(calendarId);

            // Transform the data before storing it
            const transformedEvents = response.map(event => ({
                ...event,
                start: event.startDate,
                end: event.endDate,
                calendarId: calendarId
            }));

            return transformedEvents;

            // Store the events for this specific calendar
            // this.setEvents(calendarId, transformedEvents);
        } catch (error) {
            console.error("Failed to load events:", error);
            this.setEvents(calendarId, []);
        }
    }

    async createEvent(event, selectedCalendar) {
        try {
            const response = await api.post(`/events/calendar/${selectedCalendar}`, event);

            if (response.status === 201) {
                this.setEvents(selectedCalendar, [
                    ...(this.eventsByCalendar[selectedCalendar] || []),
                    response.data
                ]);
            }
        } catch (error) {
            console.log("Failed to create event:", error);
        }
    }

    async updateEvent(eventUpdate, calendarId) {
        try {
            const response = await api.patch(`/events/${eventUpdate.id}`, eventUpdate);

            if (response.status === 200) {
                this.setEvents(calendarId,
                    (this.eventsByCalendar[calendarId] || []).map(event =>
                        event.id === eventUpdate.id ? { ...event, ...eventUpdate } : event
                    )
                );
            }
        } catch (error) {
            console.log("Failed to update event:", error);
        }
    }

    async deleteEvent(eventId, calendarId) {
        try {
            const response = await api.delete(`/events/${eventId}`);

            if (response.status === 200) {
                this.setEvents(calendarId,
                    (this.eventsByCalendar[calendarId] || []).filter(event => event.id !== eventId)
                );
            }
        } catch (error) {
            console.log("Failed to delete event:", error);
        }
    }

    setEvents(calendarId, eventsData) {
        this.eventsByCalendar = {
            ...this.eventsByCalendar,
            [calendarId]: eventsData
        };
    }

    getEventCalendarId(eventId) {
        let calendarId = null;

        Object.keys(eventStore.eventsByCalendar).forEach((key) => {
            if (eventStore.eventsByCalendar[key].some(e => e.id === eventId)) {
                calendarId = key;
            }
        });

        return calendarId;
    }

    getEvents(calendarId) {
        return this.eventsByCalendar[calendarId] || [];
    }

    getEvents() {
        // Collect all events from all calendars
        return Object.values(this.eventsByCalendar).flat();
    }

    clearEvents() {
        this.eventsByCalendar = {};
    }
}

export const eventStore = new EventStore();