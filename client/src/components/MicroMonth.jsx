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
    const firstDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).getDay();
    const lastDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
    const daysInMonth = [];

    for (let day = 1; day <= lastDay; day++) {
        daysInMonth.push(day);
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
            <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((day) => (
                    <div key={day} className="p-2 text-sm">
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MicroMonth;
