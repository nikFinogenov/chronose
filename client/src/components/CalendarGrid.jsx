import React from "react";
import dayjs from "dayjs";

const CalendarGrid = ({ events = [], month = dayjs().month(), year = dayjs().year() }) => {
    const startOfMonth = dayjs().year(year).month(month).startOf("month");
    const endOfMonth = dayjs().year(year).month(month).endOf("month");

    // Определяем первый день календаря (начало недели)
    const startOfCalendar = startOfMonth.startOf("week");
    const endOfCalendar = endOfMonth.endOf("week");
    let days = [];
    
    const totalCells = endOfCalendar.diff(startOfCalendar, 'days') <= 35 ? 35 : 42;
    // console.log(totalDays, daysFromPrevMonth, totalCells)
    for (let i = 0; i < totalCells; i++) {
        days.push(startOfCalendar.add(i, "day"));
    }

    // Группируем события по датам
    const eventsByDate = events ? events.reduce((acc, event) => {
        const dateKey = dayjs(event.startDate).format("YYYY-MM-DD");
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(event);
        return acc;
    }, {}) : null;

    return (
        <div className="grid grid-cols-7 gap-0.5 border-t border-l border-gray-300 bg-gray-100">
            {/* Заголовки дней недели */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-semibold p-2 bg-gray-200 border-r border-b">
                    {day}
                </div>
            ))}

            {/* Ячейки календаря */}
            {days.map((day) => {
                const dateKey = day.format("YYYY-MM-DD");
                const isCurrentMonth = day.month() === month;
                return (
                    <div
                        key={dateKey}
                        className={`border-r border-b p-2 h-32 relative ${
                            isCurrentMonth ? "bg-white text-black" : "bg-gray-50 text-gray-400"
                        }`}
                    >
                        <div className="text-xs font-semibold">{day.format("D")}</div>
                        <div className="absolute inset-0 p-1 overflow-auto">
                            {eventsByDate && eventsByDate[dateKey]?.map((event, index) => (
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
