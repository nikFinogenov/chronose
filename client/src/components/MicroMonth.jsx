import React, { useState } from "react";
import { dateStore } from "../store/dateStore";

function MicroMonth() {
    const [selectedMonth, setSelectedMonth] = useState(new Date(dateStore.currentDate));

    const handlePrevMonth = () => {
        setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
    };

    const monthName = selectedMonth.toLocaleString("default", { month: "long", year: "numeric" });

    // Получаем первый день недели (0 - Воскресенье, 6 - Суббота)
    const firstDayOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).getDay();
    const lastDayOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();

    // Смещение дней (если первый день месяца не воскресенье)
    const firstDayOffset = firstDayOfMonth; // теперь 0 - это Воскресенье

    // Количество дней в предыдущем месяце
    const lastMonthDays = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 0).getDate();

    // Количество дней из следующего месяца
    const totalCells = 6 * 7; // 6 строк по 7 дней
    const nextMonthDays = totalCells - (firstDayOffset + lastDayOfMonth);

    // Формируем массив дней для отображения в календаре
    const days = [];

    // Дни прошлого месяца
    for (let i = firstDayOffset; i > 0; i--) {
        days.push({
            day: lastMonthDays - i + 1,
            currentMonth: false
        });
    }

    // Дни текущего месяца
    for (let day = 1; day <= lastDayOfMonth; day++) {
        days.push({
            day,
            currentMonth: true
        });
    }

    // Дни следующего месяца
    for (let i = 1; i <= nextMonthDays; i++) {
        days.push({
            day: i,
            currentMonth: false
        });
    }

    return (
        <div className="p-4 border rounded-lg shadow-lg w-64 text-center">
            <div className="flex justify-between mb-2">
                <h2 className="text-lg font-semibold">{monthName}</h2>
                <div>
                    <button className="btn btn-sm btn-ghost" onClick={handlePrevMonth}>
                        ◀
                    </button>
                    <button className="btn btn-sm btn-ghost" onClick={handleNextMonth}>
                        ▶
                    </button>
                </div>


            </div>

            {/* Дни недели */}
            <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-gray-700">
                {["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"].map((day) => (
                    <div key={day} className="p-1">{day}</div>
                ))}
            </div>

            {/* Календарь (6x7) */}
            <div className="grid grid-cols-7 gap-1 mt-1">
                {days.map(({ day, currentMonth }, index) => (
                    <div
                        key={index}
                        className={`p-2 text-sm rounded ${currentMonth ? "text-black" : "text-gray-400"
                            }`}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MicroMonth;
