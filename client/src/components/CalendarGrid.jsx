import React from "react";
import dayjs from "dayjs";

const CalendarGrid = ({ events = [] }) => {
    const startOfWeek = dayjs().startOf("week"); // Начало недели (понедельник)
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));

    // Группируем события по датам
    const eventsByDate = events.reduce((acc, event) => {
        const dateKey = dayjs(event.startDate).format("YYYY-MM-DD");
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(event);
        return acc;
    }, {});

    return (
        <div className="grid grid-cols-7 gap-0.5 border-t border-l border-gray-300 bg-gray-100">
            {daysOfWeek.map((day) => {
                const dateKey = day.format("YYYY-MM-DD");
                return (
                    <div
                        key={dateKey}
                        className="border-r border-b border-gray-300 p-2 h-40 bg-white relative"
                    >
                        <div className="text-xs font-semibold text-gray-700">
                            {day.format("ddd, DD")}
                        </div>
                        <div className="absolute inset-0 p-1 overflow-auto">
                            {eventsByDate[dateKey]?.map((event, index) => (
                                <div
                                    key={index}
                                    className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md mb-1 shadow-sm"
                                >
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CalendarGrid;
