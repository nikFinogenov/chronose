import {runInAction, makeAutoObservable } from "mobx";
import { getUserCalendars, getinvitedUserCalendars } from "../services/userService";
import { createCalendar, update, inviteUser, removeUserFromCalendar, getCalendarUsers } from '../services/calendarService';
import { joinCalendar } from '../services/calendarService';

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
			this.setInvitedCalendars(response);
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

	async joinCalendar(inviteToken) {
		try {
			const calendar = await joinCalendar(inviteToken);
			runInAction(() => {
				console.log('Joined calendar:', calendar);
				this.calendars.push(calendar);
			});
			return calendar;
		} catch (error) {
			console.error('Failed to join calendar:', error);
			throw error;
		}
	}

	async loadCalendarUsers(calendarId) {
		try {
			const users = await getCalendarUsers(calendarId);
			runInAction(() => {
				this.calendarUsers = users;
			});
		} catch (error) {
			console.error('Failed to load calendar users:', error);
			this.calendarUsers = [];
		}
	}

	async removeUserFromCalendar(calendarId, userId) {
		try {
			await removeUserFromCalendar(calendarId, userId);
			runInAction(() => {
				this.calendarUsers = this.calendarUsers.filter(user => user.id !== userId);
			});
		} catch (error) {
			console.error('Failed to remove user from calendar:', error);
		}
	}
}

export const calendarStore = new CalendarStore();
