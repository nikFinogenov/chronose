import React from "react";
import { observer } from "mobx-react-lite";
import Sidebar from "../components/Sidebar";
import { dateStore } from "../store/dateStore";
import { userStore } from "../store/userStore";

const Day = observer(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const currentDate = new Date(dateStore.currentDate);
    
    const dayNumber = currentDate.getDate();
    const dayShort = currentDate.toLocaleString("ru-RU", { weekday: "short" }).toUpperCase();
    const timezone = userStore.user?.country ? `GMT+${new Date().getTimezoneOffset() / -60}` : "GMT";
    console.log(userStore.user?.country);

    return (
        <div className="flex h-screen p-4">
            <Sidebar />
            <div className="flex-grow flex flex-col px-4">
                {/* Заголовок */}
                <div className="flex items-center mb-4">
                    <span className="text-gray-500 mr-4">{timezone}</span>
                    <div className="flex flex-col items-center">
                        <span className="text-sm text-gray-500">{dayShort}</span>
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white text-lg font-bold">
                            {dayNumber}
                        </div>
                    </div>
                </div>

                {/* Скролл для часов */}
                <div className="relative flex-grow overflow-y-auto border-l-2 border-gray-300">
                    {hours.map((hour) => (
                        <div key={hour} className="relative h-16 mt-2 border-b border-gray-300">
                            <div className="absolute left-0 -translate-y-2 text-sm text-gray-500">
                                {hour.toString().padStart(2, "0")}:00
                            </div>
                        </div>
                    ))}
                    {/* Тут будут события */}
                </div>
            </div>
        </div>
    );
});

export default Day;
