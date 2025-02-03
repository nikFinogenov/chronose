import { makeAutoObservable, runInAction } from "mobx";
// import axios from "axios"; // Предполагается, что вы используете axios для запросов
import { api } from "../services";
import { createUser } from "../services/userService";

class UserStore {
    user = null; // Хранит информацию о текущем пользователе
    loading = false; // Состояние загрузки
    error = null; // Ошибка, если она возникла

    constructor() {
        makeAutoObservable(this);
    }

    // Метод для регистрации пользователя
    async register(fullName, email, password) {
        this.loading = true; // Устанавливаем состояние загрузки
        this.error = null; // Сбрасываем ошибку

        try {
            // const response = await api.post(`${API_URL}/register/`, {
            //     email,
            //     username,
            //     fullName,
            //     password
            // });
            const response = await createUser(fullName, email, password);

            // Если регистрация успешна, сохраняем пользователя
            runInAction(() => {
                this.user = response.data.user; // Предполагается, что сервер возвращает объект пользователя
            });

            return response.data.message; // Возвращаем сообщение от сервера
        } catch (error) {
            runInAction(() => {
                this.error = error.response ? error.response.data.error : "Registration failed"; // Обработка ошибки
            });
            throw error; // Пробрасываем ошибку дальше
        } finally {
            runInAction(() => {
                this.loading = false; // Сбрасываем состояние загрузки
            });
        }
    }

    // Метод для выхода из системы
    async logout() {
        try {
            // await api.post('/api/logout');
            runInAction(() => {
                this.user = null; // Сбрасываем пользователя
            });
        } catch (error) {
            console.error("Logout failed", error);
        }
    }

    // Метод для получения информации о пользователе
    async fetchUser () {
        try {
            const response = await api.get('/api/user');
            runInAction(() => {
                this.user = response.data.user; // Сохраняем информацию о пользователе
            });
        } catch (error) {
            console.error("Fetch user failed", error);
        }
    }
}

export const userStore = new UserStore();