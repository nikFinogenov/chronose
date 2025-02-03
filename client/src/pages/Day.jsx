import React from "react";
import Sidebar from "../components/Sidebar";

function Day() {
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div className="flex flex-col h-screen p-4">
            <div className="flex w-full px-4 mt-4">
                <Sidebar />
                <div className="w-full">
                <h2 className="text-2xl font-bold mb-4">Сегодня</h2>
                    <div className="relative border-l-2 border-gray-300">
                        {hours.map((hour) => (
                            <div key={hour} className="relative h-16 border-b border-gray-300">
                                <div className="absolute left-0 -translate-y-2 text-sm text-gray-500">
                                    {hour.toString().padStart(2, "0")}:00
                                </div>
                            </div>
                        ))}
                        {/* Здесь будут события */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Day;
