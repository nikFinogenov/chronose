import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { dateStore } from "../store/dateStore";

const MicroMonth = observer(({ month = null }) => {
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(new Date(dateStore.currentDate));
    const [selectedDay, setSelectedDay] = useState({
        day: selectedMonth.getDate(),
        month: selectedMonth.getMonth(),
        year: selectedMonth.getFullYear(),
    });
    
    today.setHours(0, 0, 0, 0);

    useEffect(() => {
        // Update the selected date when the dateStore.currentDate changes
        const currentDate = new Date(dateStore.currentDate);
        setSelectedMonth(currentDate);
        setSelectedDay({
            day: currentDate.getDate(),
            month: currentDate.getMonth(),
            year: currentDate.getFullYear(),
        });
    }, [dateStore.currentDate]); // eslint-disable-line

    if (!selectedMonth) return null; // Prevent rendering before state is initialized

    const handlePrevMonth = () => {
        setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
    };

    const handleDayClick = (day, currentMonth, monthNum) => {
        if (currentMonth && !month) {
            setSelectedDay({
                day,
                month: monthNum,
                year: selectedMonth.getFullYear(),
            });
            dateStore.updateDate(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
        } else if (!currentMonth) {
            if (monthNum > selectedMonth.getMonth()) {
                setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
                setSelectedDay({
                    day,
                    month: monthNum,
                    year: selectedMonth.getFullYear(),
                });
                dateStore.updateDate(selectedMonth.getFullYear(), monthNum, day);
            } else {
                setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
                setSelectedDay({
                    day,
                    month: monthNum,
                    year: selectedMonth.getFullYear(),
                });
                dateStore.updateDate(selectedMonth.getFullYear(), monthNum, day);
            }
        }
    };

    const mnth = month
        ? new Date(new Date(dateStore.currentDate).getFullYear(), Number(month) - 1, 1)
        : selectedMonth;

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
                    const isToday =
                        today.getTime() === new Date(mnth.getFullYear(), monthNum, day).getTime() &&
                        currentMonth;

                    const isSelected =
                        selectedDay &&
                        selectedDay.day === day &&
                        selectedDay.month === monthNum &&
                        selectedDay.year === mnth.getFullYear(); // Ensure the year matches

                    // Only render selected day for current month, not next or previous month
                    if (!currentMonth && isSelected) return null;

                    return (
                        <div
                            key={index}
                            className={`flex justify-center items-center w-8 h-8 text-sm rounded-full 
                              ${currentMonth ? "text-black" : "text-gray-400"}  
                              ${isToday ? "border border-indigo-600 bg-indigo-400 font-bold text-white" 
                              : isSelected ? "bg-indigo-200" : "hover:bg-gray-200"} 
                              cursor-pointer`}
                            onClick={() => handleDayClick(day, currentMonth, monthNum)}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

export default MicroMonth;
