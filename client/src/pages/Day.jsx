import React, { useState } from "react";
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

    // Состояние событий
    const [events, setEvents] = useState([]);
    const [dragging, setDragging] = useState(null);
    const [resizeIndex, setResizeIndex] = useState(null);
    const [startY, setStartY] = useState(0);
    const [menuEventId, setMenuEventId] = useState(null);

    // Добавление события
    const handleAddEvent = (hour, e) => {
        const rect = e.target.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const isBottomHalf = clickY > rect.height / 2;

        const startTime = isBottomHalf ? `${hour}:30` : `${hour}:00`;
        const endTime = isBottomHalf ? `${hour + 1}:30` : `${hour + 1}:00`;

        setEvents((prevEvents) => [
            ...prevEvents,
            { id: Date.now(), startHour: hour, startTime, endTime, height: 60 },
        ]);
    };

    // Удаление события
    const handleDeleteEvent = (id) => {
        setEvents(events.filter((event) => event.id !== id));
        setMenuEventId(null);
    };

    // Начало растягивания
    const handleResizeStart = (e, index) => {
        e.stopPropagation();
        setResizeIndex(index);
        setStartY(e.clientY);
    };

    // Обработчик движения
    const handleMouseMove = (e) => {
        if (resizeIndex !== null) {
            const delta = e.clientY - startY;
            setEvents((prevEvents) => {
                const newEvents = [...prevEvents];
                const event = newEvents[resizeIndex];
    
                let newHeight = Math.max(30, event.height + delta);
                let newEndMinutes = (event.startHour * 60) + (event.startTime.includes("30") ? 30 : 0) + newHeight;
    
                let newEndHour = Math.floor(newEndMinutes / 60);
                let newEndMinute = newEndMinutes % 60;
                let newEndTime = `${newEndHour}:${newEndMinute === 0 ? "00" : "30"}`;
    
                event.height = newHeight;
                event.endTime = newEndTime;
    
                return newEvents;
            });
            setStartY(e.clientY);
        }
    };

    // Завершение растягивания
    const handleMouseUp = () => {
        setResizeIndex(null);
    };

    return (
        <div className="flex h-screen p-4" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
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
                        <div key={hour} className="relative h-16 border-b border-gray-300">
                            <div className="absolute left-0 -translate-y-2 text-sm mt-2 text-gray-500">
                                {hour.toString().padStart(2, "0")}:00
                            </div>
                            <div
                                className="absolute top-0 left-0 w-full h-full cursor-pointer"
                                onClick={(e) => handleAddEvent(hour, e)}
                            />
                        </div>
                    ))}

                    {/* Отображение событий */}
                    {events.map((event, index) => (
                        <div
                            key={event.id}
                            className="absolute left-0 w-full bg-blue-400 text-white shadow-md rounded-md cursor-pointer"
                            style={{
                                top: `${event.startHour * 64 + (event.startTime.includes("30") ? 30 : 0)}px`,
                                height: `${event.height}px`,
                            }}
                            onClick={() => setMenuEventId(menuEventId === event.id ? null : event.id)}
                        >
                            <div className="p-2 text-sm font-semibold">
                                {event.startTime} - {event.endTime}
                            </div>

                            {/* Хендл для изменения высоты */}
                            <div
                                className="absolute bottom-0 left-0 w-full h-3 bg-blue-600 cursor-ns-resize"
                                onMouseDown={(e) => handleResizeStart(e, index)}
                            ></div>

                            {/* Контекстное меню */}
                            {menuEventId === event.id && (
                                <div className="absolute top-0 right-0 bg-white shadow-md rounded-md p-2 text-black">
                                    <button
                                        className="text-red-500 hover:bg-gray-200 p-1 rounded"
                                        onClick={() => handleDeleteEvent(event.id)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default Day;
