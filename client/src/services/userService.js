import { api } from './index'
import { userStore } from '../store/userStore';

const API_URL = process.env.REACT_APP_API_URL;

export const createUser = async (fullName, email, password) => {
    try {
        const response = await api.post(`${API_URL}/auth/register`, {
            fullName, email, password
        });
        // const response = await userStore.register(login, email, fullName, password);
        return response.data;
    } catch (error) {
        throw error;
    }
};
