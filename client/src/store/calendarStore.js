import { makeAutoObservable } from "mobx";
import { getUserCalendars, getinvitedUserCalendars } from "../services/userService";
import { createCalendar } from "../services/calendarService"

class CalendarStore {
    calendars = [];
    invitedCalendars = [];

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

    async loadInvitedCalendars(userId) {
        if (!userId) {
            this.invitedCalendars = [];
            return;
        }

        try {
            const response = await getinvitedUserCalendars(userId);
            this.setInvitedCalendars(response);
        } catch (error) {
            console.error("Failed to load user calendars:", error);
            this.invitedCalendars = [];
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

    setInvitedCalendars(calendarData) {
        this.invitedCalendars = calendarData;
    }
}

export const calendarStore = new CalendarStore();
