import {runInAction, makeAutoObservable } from "mobx";
import { getUserCalendars, getinvitedUserCalendars } from "../services/userService";
import { createCalendar, update, inviteUser } from '../services/calendarService';

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
            const storedVisibility = JSON.parse(localStorage.getItem('calendarVisibility')) || {};

            // Append isActive property to each calendar based on localStorage or default to true
            this.calendars = response.map(calendar => ({
                ...calendar,
                isActive: storedVisibility[calendar.id] ?? true
            }));
    
            // Ensure localStorage is updated with missing items
            response.forEach(calendar => {
                if (!(calendar.id in storedVisibility)) {
                    storedVisibility[calendar.id] = true;
                }
            });
    
            localStorage.setItem('calendarVisibility', JSON.stringify(storedVisibility));
            
            this.setCalendars(this.calendars);
		} catch (error) {
			console.error('Failed to load user calendars:', error);
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
            const storedVisibility = JSON.parse(localStorage.getItem('calendarVisibility')) || {};
            this.invitedCalendars = response.map(calendar => ({
                ...calendar,
                isActive: storedVisibility[calendar.id] ?? true
            }));
    
            // Ensure localStorage is updated with missing items
            response.forEach(calendar => {
                if (!(calendar.id in storedVisibility)) {
                    storedVisibility[calendar.id] = true;
                }
            });
            localStorage.setItem('calendarVisibility', JSON.stringify(storedVisibility));
			this.setInvitedCalendars(this.invitedCalendars);
		} catch (error) {
			console.error('Failed to load user calendars:', error);
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
			console.error('Failed to create calendar:', error);
		}
	}

	async updateCalendar(updatedCalendar) {
		try {
			const response = await update(updatedCalendar);
			if (response) {
				// Use runInAction to modify the observable state
				runInAction(() => {
					this.calendars = this.calendars.map(calendar => (calendar.id === updatedCalendar.id ? { ...calendar, ...updatedCalendar } : calendar));
				});
			}
		} catch (error) {
			console.error('Failed to update calendar:', error);
		}
	}

	async inviteUser(calendarId, email, role) {
		try {
			await inviteUser(calendarId, email, role);
			console.log(`User ${email} invited as ${role} to calendar ${calendarId}`);
		} catch (error) {
			console.error('Failed to invite user:', error);
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
