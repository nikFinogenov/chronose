import { makeAutoObservable, action } from "mobx";
import { api } from "../services";
import { getCalendarEvents } from "../services/eventService";
import { calendarStore } from "./calendarStore";


class EventStore {
    eventsByCalendar = {}; // Store events grouped by calendarId

    events = [];

    constructor() {
        makeAutoObservable(this
            , {
                loadEventsForCalendar: action,
                createEvent: action,
                updateEvent: action,
                deleteEvent: action,
            }
        );
    }

    async loadEventsForCalendar(calendarId, start, end, allDay = false) {
        if (!calendarId) return;

        try {
            const response = await getCalendarEvents(calendarId, start, end);

            // if(!allDay) {
            //     allDay = start === end ? true : false
            // };

            // Transform the data before storing it
            const transformedEvents = response.map(event => ({
                ...event,
                start: event.startDate,
                end: event.endDate,
                calendarId: calendarId,
                allDay: !allDay ? (event.startDate === event.endDate ? true : false) : false,
            }));
            console.log(transformedEvents);

            // return transformedEvents;
            this.setEvents(calendarId, transformedEvents);

            // Store the events for this specific calendar
            // this.setEvents(calendarId, transformedEvents);
        } catch (error) {
            console.error("Failed to load events:", error);
            this.setEvents(calendarId, []);
        }
    }

    async createEvent(event, selectedCalendar, repeat) {
        try {
            let response;
            if(repeat) response = await api.post(`/events/calendar/repeat/${selectedCalendar}`, {...event, repeatNess: repeat});
            else response = await api.post(`/events/calendar/${selectedCalendar}`, event);
            // console.log(response.data.event);
            if (response.status === 201) {
                // console.log(response.data.event.startDate);
                const createdEvent = {
                    ...response.data.event,
                    start: response.data.event.startDate,
                    end: response.data.event.endDate,
                    allDay: response.data.event.startDate === response.data.event.endDate ? true : false,
                    calendarId: selectedCalendar,
                };
                this.setEvents(selectedCalendar, [
                    ...(this.eventsByCalendar[selectedCalendar] || []),
                    createdEvent
                ]);
                // console.log("event created");
                // return response.data.event;
            }
        } catch (error) {
            console.log("Failed to create event:", error);
            // return null;
        }
    }

    async updateEvent(eventUpdate, calendarId) {
        try {
            const response = await api.patch(`/events/${eventUpdate.id}`, eventUpdate);

            if (response.status === 200) {
                this.setEvents(calendarId,
                    (this.eventsByCalendar[calendarId] || []).map(event =>
                        event.id === eventUpdate.id ? { ...event, ...eventUpdate, 
                            allDay: eventUpdate.start === eventUpdate.end } : event,
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

    // getEvents() {
    //     // Collect all events from all calendars
    //     return Object.values(this.eventsByCalendar).flat();
    // }
    async loadEventsForAllCalendars(currentDate) {
        const endOfDay = new Date(currentDate);
        endOfDay.setUTCHours(23, 59, 0, 0);

        const allCalendars = [
            ...calendarStore.calendars.filter(calendar => calendar.isActive),
            ...calendarStore.invitedCalendars.filter(calendar => calendar.isActive)
        ];

        for (const calendar of allCalendars) {
            await this.loadEventsForCalendar(calendar.id, currentDate, endOfDay.toISOString());
        }
    }

    clearEvents() {
        this.eventsByCalendar = {};
    }
}

export const eventStore = new EventStore();