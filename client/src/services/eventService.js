import { api } from './index'

export const getCalendarEvents = async (calendarId, start, end) => {
    try {
        const response = await api.get(`events/calendar/${calendarId}`, { params: { start, end } });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log("Failed to fetch events:", error);
    }
}