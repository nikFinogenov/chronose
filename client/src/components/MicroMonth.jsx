import React, { useState, useEffect } from "react";
import { dateStore } from "../store/dateStore";

function MicroMonth({ month = null }) {
    const [selectedMonth, setSelectedMonth] = useState(null);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // const currentYear = ;
    useEffect(() => {
        const newDate = month
            ? new Date(new Date(dateStore.currentDate).getFullYear(), Number(month) - 1, 1)
            : new Date(dateStore.currentDate);
        setSelectedMonth(newDate);
    }, [month]);

    if (!selectedMonth) return null; // Prevent rendering before state is initialized

    const handlePrevMonth = () => {
        setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
    };

    const monthName = selectedMonth.toLocaleString("default", { month: "long", year: "numeric" });

    const firstDayOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).getDay();
    const lastDayOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
    const firstDayOffset = firstDayOfMonth;

    const lastMonthDays = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 0).getDate();
    const totalCells = 6 * 7;
    const nextMonthDays = totalCells - (firstDayOffset + lastDayOfMonth);

    const days = [];

    // Previous month days
    for (let i = firstDayOffset; i > 0; i--) {
        days.push({
            day: lastMonthDays - i + 1,
            currentMonth: false,
            monthNum: selectedMonth.getMonth() - 1
        });
    }

    // Current month days
    for (let day = 1; day <= lastDayOfMonth; day++) {
        days.push({
            day,
            currentMonth: true,
            monthNum: selectedMonth.getMonth()
        });
    }

    // Next month days
    for (let i = 1; i <= nextMonthDays; i++) {
        days.push({
            day: i,
            currentMonth: false,
            monthNum: selectedMonth.getMonth() + 1
        });
    }

    return (
        <div className="p-4 border rounded-lg shadow-lg w-64 text-center">
            <div className="flex justify-between mb-2">
                <h2 className="text-lg font-semibold">{month ? monthName.split(' ')[0] : monthName}</h2>
                <div>
                    <button className={`btn btn-sm btn-ghost ${month ? "hidden" : ""}`} onClick={handlePrevMonth}>
                        ◀
                    </button>
                    <button className={`btn btn-sm btn-ghost ${month ? "hidden" : ""}`} onClick={handleNextMonth}>
                        ▶
                    </button>
                </div>
            </div>

            {/* Days of the week */}
            <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-gray-700">
                {["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"].map((day) => (
                    <div key={day} className="p-1">{day}</div>
                ))}
            </div>

            {/* Calendar Grid (6x7) */}
            <div className="grid grid-cols-7 gap-1 mt-1">
                {days.map(({ day, currentMonth, monthNum }, index) => {
                    return (
                        <div
                            key={index}
                            className={`p-2 text-sm 
                                ${currentMonth ? "text-black" : "text-gray-400"} 
                                ${today.getTime() === new Date(selectedMonth.getFullYear(), monthNum, day).getTime() ? "border border-indigo-600" : ""}
                                `}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
// ${today.getTime() === dateToCompare.getTime() ? "border border-blue-500" : ""}
export default MicroMonth;
