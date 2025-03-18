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
}