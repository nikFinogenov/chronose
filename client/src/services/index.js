import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userStore } from "../store/userStore"; // Импортируйте userStore
import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
    headers: {
		'Content-Type': 'application/json',
	},
});

const AxiosInterceptor = () => {
    const navigate = useNavigate();

    api.interceptors.request.use((config) => {
        // console.log(!userStore.user.isEmailConfirmed);
        // Проверяем, подтвержден ли email пользователя
        if (userStore.user && !userStore.user.isEmailConfirmed) {
            Swal.fire({
                text: 'Confirm your email first',
                icon: 'warning',
                confirmButtonText: 'Ok'
            })

            // console.log(userStore.user);
            const controller = new AbortController();
            config.signal = controller.signal;

            controller.abort();
            // Здесь можно добавить уведомление, если нужно
            // showNotification("Please confirm your email to perform this action.", "error");

            return config;
        }

        // Добавляем токен авторизации, если пользователь авторизован
        if (userStore.user) {
            config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
        }

        return config;
    });

    api.interceptors.response.use(
        (response) => {
            return response; // Возвращаем ответ
        },
        async (error) => {
            // console.log(error);
            if (axios.isCancel(error)) {
                // console.log("Request was canceled:", error.message);
                return Promise.resolve({ data: null });
            }
            if (error.response) {
                if (error.response.status === 401) {
                    await userStore.logout(); // Вызываем метод logout из userStore
                    navigate("/login");
                    // Здесь можно добавить уведомление, если нужно
                    // showNotification("Please log in.", "error");
                }
                if (error.response.status === 403) {
                    // Здесь можно добавить уведомление, если нужно
                    // showNotification("Access denied. You do not have permission to perform this action.", "error");
                }
            }
            throw error; // Пробрасываем ошибку дальше
        }
    );

    return null; // Компонент не рендерит ничего
};

export { api, AxiosInterceptor };