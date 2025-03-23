import { api } from './index'

export const getCalendarEvents = async (calendarId) => {
    try {
        const response = await api.get(`events/calendar/${calendarId}`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log("Failed to fetch events:", error);
    }
};

export const joinEvent = async (inviteToken) => {
    try {
        const response = await api.post(`events/join/${inviteToken}`);
        return response.data;
    } catch (error) {
        console.error("Failed to join event:", error);
        throw error;
    }
};

export const inviteUser = async (eventId, email, role) => {
    try {
        const response = await api.post(`events/invite/${encodeURIComponent(eventId)}`, {
			email,
			role,
		});
        return response.data;
    } catch (error) {
        console.error('Error inviting user:', error);
        throw error;
    }
};

export const getEventUsers = async eventId => {
	try {
		const response = await api.get(`events/${eventId}/users`);
		return response.data;
	} catch (error) {
		console.error('Error fetching event users:', error);
		throw error;
	}
};

export const removeUserFromEvent = async (eventId, userId) => {
	try {
		await api.delete(`events/${eventId}/users/${userId}`);
		console.log(`User ${userId} removed from event ${eventId}`);
	} catch (error) {
		console.error('Error removing user from event:', error);
		throw error;
	}
};