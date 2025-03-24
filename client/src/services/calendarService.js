// import { responsiveFontSizes } from '@mui/material';
import { api } from './index'

const API_URL = process.env.REACT_APP_API_URL;


export const getCalendar = async (fullName, email, password) => {
    try {
        const countryData = await fetch('https://ipapi.co/json/');
        const data = await countryData.json();
        const country = data && data.country_name ? data.country_name : null;
        const response = await api.post(`${API_URL}/auth/register`, {
            fullName, email, password, country
        });
        // const response = await userStore.register(login, email, fullName, password);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createCalendar = async (name, description, color, ownerId) => {
    try {
        const response = await api.post(`${API_URL}/calendars`, {
            name, description, color, ownerId
        });
        // const response = await userStore.register(login, email, fullName, password);
        return response;
    } catch (error) {
        throw error;
    }
};

export const update = async (calendar) => {
    try {
        const response = await api.patch(`/calendars/${calendar.id}`, calendar);
        
        return response;
    } catch(error) {
        throw error;
    }
};

export const inviteUser = async (calendarId, email, role) => {
	try {
		const response = await api.post(`${API_URL}/calendars/invite/${encodeURIComponent(calendarId)}`, {
			email,
			role,
		});
		return response.data;
	} catch (error) {
		console.error('Error inviting user:', error);
		throw error;
	}
};

export const joinCalendar = async (inviteToken) => {
	try {
		const response = await api.post(`calendars/join/${inviteToken}`);
		return response.data;
	} catch (error) {
		console.error('Failed to join calendar:', error);
		throw error;
	}
};

export const getCalendarUsers = async calendarId => {
	try {
		const response = await api.get(`${API_URL}/calendars/${calendarId}/users`);
		return response.data;
	} catch (error) {
		console.error('Error fetching calendar users:', error);
		throw error;
	}
};

export const removeUserFromCalendar = async (calendarId, userId) => {
	try {
		const response = await api.delete(`${API_URL}/calendars/${calendarId}/users/${userId}`);
		return response.data;
	} catch (error) {
		console.error('Error removing user from calendar:', error);
		throw error;
	}
};