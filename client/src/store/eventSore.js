import { makeAutoObservable } from "mobx";
// import { getEventsForCalendar } from "../services/eventService";

class EventStore {
    events = [];

    constructor() {
        makeAutoObservable(this);
    }

    async loadEvents(calendarId) {
        if (!calendarId) {
            this.events = [];
            return;
        }

        try {
            // const response = await getEventsForCalendar(calendarId);
            // this.events = response;
        } catch (error) {
            console.error("Failed to load events:", error);
            this.events = [];
        }
    }

    clearEvents() {
        this.events = [];
    }
}

export const eventStore = new EventStore();
