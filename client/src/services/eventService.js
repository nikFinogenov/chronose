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