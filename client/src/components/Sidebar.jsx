import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import MicroMonth from "./MicroMonth";
import { dateStore } from "../store/dateStore";
import { userStore } from "../store/userStore";
import { calendarStore } from "../store/calendarStore";

const Sidebar = observer(() => {
    useEffect(() => {
        if (userStore.user) {
            calendarStore.loadCalendars(userStore.user.id);
        }

        // return () => {
        //     calendarStore.clearCalendars(); // Clear calendars on user logout
        // };
    }, []);

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
                    <div className="collapse-title font-semibold">My calendars</div>
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
        </div>
    );
});

export default Sidebar;
