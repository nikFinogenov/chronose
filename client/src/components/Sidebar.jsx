import React, { useEffect, useState } from "react";
import MicroMonth from "./MicroMonth";
import { dateStore } from "../store/dateStore";
import { userStore } from "../store/userStore";
import { getUserCalendars } from "../services/userService";

function Sidebar() {
    const [calendars, setCalendars] = useState([]);

    useEffect(() => {
        const loadCalendars = async () => {
            try {
                if (userStore.user) {
                    const response = await getUserCalendars(userStore.user.id);
                    setCalendars(response); // Устанавливаем календари в state
                }
            } catch (error) {
                console.error("Failed to load user calendars:", error);
            }
        };
        loadCalendars();
    }, []);

    return (
        <div className="p-4 border-r border-gray-300 bg-base-100 min-h-screen">
            <div className="mb-4 text-lg font-semibold">
                Today is {new Date(dateStore.currentDate).toLocaleDateString()}
            </div>

            <MicroMonth />

            <div className="join join-vertical w-full bg-base-100 mt-4">
                {/* My Calendars */}
                <div className="collapse collapse-arrow join-item border border-base-300">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title font-semibold">My calendars</div>
                    <div className="collapse-content text-sm space-y-2">
                        {calendars.length > 0 ? (
                            calendars.map((calendar) => (
                                <label key={calendar.id} className="flex items-center gap-2">
                                    <input type="checkbox" className="checkbox checkbox-primary" />
                                    <span>{calendar.name}</span>
                                </label>
                            ))
                        ) : (
                            <p className="text-gray-500">No calendars found</p>
                        )}
                    </div>
                </div>

                {/* Other Calendars */}
                <div className="collapse collapse-arrow join-item border border-base-300">
                    <input type="checkbox" />
                    <div className="collapse-title font-semibold">Other calendars</div>
                    <div className="collapse-content text-sm text-gray-500">
                        No additional calendars available.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
