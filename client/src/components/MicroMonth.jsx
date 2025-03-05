import React, { useState, useEffect } from "react";
import { dateStore } from "../store/dateStore";

function MicroMonth({ month = null }) {
    const [selectedMonth, setSelectedMonth] = useState(new Date(dateStore.currentDate));
    const selectectedMonthForParameter = new Date(new Date(dateStore.currentDate).getFullYear(), Number(month) - 1, 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!selectedMonth) return null; // Prevent rendering before state is initialized

    const handlePrevMonth = () => {
        setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
    };
    const mnth = month ? selectectedMonthForParameter : selectedMonth;

    const monthName = mnth.toLocaleString("default", { month: "long", year: "numeric" });

    const firstDayOfMonth = new Date(mnth.getFullYear(), mnth.getMonth(), 1).getDay();
    const lastDayOfMonth = new Date(mnth.getFullYear(), mnth.getMonth() + 1, 0).getDate();
    const firstDayOffset = firstDayOfMonth;

    const lastMonthDays = new Date(mnth.getFullYear(), mnth.getMonth(), 0).getDate();
    const totalCells = 6 * 7;
    const nextMonthDays = totalCells - (firstDayOffset + lastDayOfMonth);

    const days = [];

    // Previous month days
    for (let i = firstDayOffset; i > 0; i--) {
        days.push({
            day: lastMonthDays - i + 1,
            currentMonth: false,
            monthNum: mnth.getMonth() - 1
        });
    }

    // Current month days
    for (let day = 1; day <= lastDayOfMonth; day++) {
        days.push({
            day,
            currentMonth: true,
            monthNum: mnth.getMonth()
        });
    }

    // Next month days
    for (let i = 1; i <= nextMonthDays; i++) {
        days.push({
            day: i,
            currentMonth: false,
            monthNum: mnth.getMonth() + 1
        });
    }

    return (
        <div className="p-4 border rounded-lg shadow-lg w-64 text-center mt-50">
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
                {["Vs", "Pn", "Vt", "Sr", "Cht", "Pt", "St"].map((day) => (
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
                                ${today.getTime() === new Date(mnth.getFullYear(), monthNum, day).getTime() && currentMonth ? "border border-indigo-600" : ""}
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
