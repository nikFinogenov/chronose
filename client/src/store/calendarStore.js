import { makeAutoObservable } from "mobx";
import { getUserCalendars } from "../services/userService";
import { createCalendar } from "../services/calendarService"

class CalendarStore {
    calendars = [];

    constructor() {
        makeAutoObservable(this);
    }

    async loadCalendars(userId) {
        if (!userId) {
            this.calendars = [];
            return;
        }

        try {
            const response = await getUserCalendars(userId);
            this.setCalendars(response);
        } catch (error) {
            console.error("Failed to load user calendars:", error);
            this.calendars = [];
        }
    }

    async newCalendar(name, desc, userId) {
        try {
            const response = await createCalendar(name, desc, userId);
            if (response.status === 201) {
                this.setCalendars([...this.calendars, response.data]); // Append new calendar
                // this.calendars.push(response.data);
            }
            // this.setCalendars(response);
        } catch (error) {
            console.error("Failed to create calendar:", error);
        }
    }
    clearCalendars() {
        this.calendars = [];
    }
    setCalendars(calendarData) {
        this.calendars = calendarData;
    }
}

export const calendarStore = new CalendarStore();
