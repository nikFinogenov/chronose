import { responsiveFontSizes } from '@mui/material';
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

export const createCalendar = async (name, description, ownerId) => {
    try {
        const response = await api.post(`${API_URL}/calendars`, {
            name, description, ownerId
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
}