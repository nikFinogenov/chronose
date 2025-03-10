import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import MicroMonth from "./MicroMonth";
import { dateStore } from "../store/dateStore";
import { userStore } from "../store/userStore";
import { calendarStore } from "../store/calendarStore";
import { CiSquarePlus } from "react-icons/ci";

const Sidebar = observer(() => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [calendarName, setCalendarName] = useState("");

    useEffect(() => {
        if (userStore.user) {
            calendarStore.loadCalendars(userStore.user.id);
        }
    }, []);

    const handleCreateCalendar = () => {
        if (calendarName.trim()) {
            calendarStore.newCalendar(calendarName, "asd", userStore.user.id)
            // console.log("Creating calendar:", calendarName);
            setIsModalOpen(false);
            setCalendarName("");
        }
    };

    return (
        <div className="p-4 border-r border-gray-300 bg-base-100 min-h-screen">
            <p className="hidden">{userStore.user?.id ? "" : ""}</p>
            <div className="mb-4 text-lg font-semibold">
                Today is {new Date(dateStore.currentDate).toLocaleDateString()}
            </div>

            <MicroMonth />

            <div className="join join-vertical w-full bg-base-100 mt-4">
                <div className="collapse collapse-arrow join-item border border-base-300">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title font-semibold flex justify-between z-10 items-center">
                        <span>My calendars</span>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-2xl p-1 rounded-lg hover:bg-gray-200 transition"
                        >
                            <CiSquarePlus />
                        </button>
                    </div>
                    <div className="collapse-content text-sm space-y-2">
                        {calendarStore.calendars?.length > 0 ? (
                            calendarStore.calendars.map((calendar) => (
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

                <div className="collapse collapse-arrow join-item border border-base-300">
                    <input type="checkbox" />
                    <div className="collapse-title font-semibold">Other calendars</div>
                    <div className="collapse-content text-sm text-gray-500">
                        No additional calendars available.
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg font-semibold mb-4">Create New Calendar</h2>
                        <input
                            type="text"
                            value={calendarName}
                            onChange={(e) => setCalendarName(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Calendar name"
                        />
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-600 hover:text-gray-900">
                                Cancel
                            </button>
                            <button onClick={handleCreateCalendar} className="bg-primary text-white px-4 py-2 rounded">
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default Sidebar;
