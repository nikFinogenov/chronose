import { api } from './index'
// import { userStore } from '../store/userStore';

const API_URL = process.env.REACT_APP_API_URL;

export const getUserCalendars = async (id) => {
    try {
        // console.log(id);
        const response = await api.get(`${API_URL}/users/${encodeURIComponent(id)}/owned-calendars`);
        return response.data;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

export const createUser = async (fullName, email, password) => {
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

export const getUser = async (email, password) => {
    try {
        const response = await api.post(`${API_URL}/auth/login`, {
            email, password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const response = await api.post(`${API_URL}/auth/me`, { token });
        return response.data.user;
    } catch (error) {
        if (error.response?.status === 401) {
            return null; // Token is invalid/expired, return null
        }
        throw error; // Rethrow other errors
    }
};
