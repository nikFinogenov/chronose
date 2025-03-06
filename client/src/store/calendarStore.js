import { makeAutoObservable } from "mobx";
import { getUserCalendars } from "../services/userService";

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

    clearCalendars() {
        this.calendars = [];
    }
    setCalendars(calendarData) {
        this.calendars = calendarData;
      }
}

export const calendarStore = new CalendarStore();
