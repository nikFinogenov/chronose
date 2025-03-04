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

export const createCalendar = async (fullName, email, password) => {
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