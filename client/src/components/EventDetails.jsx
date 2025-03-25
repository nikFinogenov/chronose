import React, { useEffect } from "react";
import { FaTimes, FaEdit, FaTrash, FaClock, FaCalendarAlt } from "react-icons/fa";
import { calendarStore } from "../store/calendarStore";
// import { eventStore } from "../store/eventStore";

const EventDetails = ({ event, onClose, onEdit, onDelete }) => {
    const calendar = calendarStore.calendars.find((cal) => cal.id === event.calendarId);
    const calendar2 = calendarStore.invitedCalendars.find((cal) => cal.id === event.calendarId);
    const calendarName = calendar || calendar2 ? calendar?.name || calendar2?.name : "Unknown Calendar";

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Backspace") {
                e.preventDefault(); // Prevent default behavior (like going back in browser)
                onDelete(event.id);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [event.id, onDelete]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
                {/* Header Icons */}
                <div className="absolute top-3 right-3 flex space-x-2">
                    <button onClick={() => onEdit(event)} className="text-blue-500 hover:text-blue-700">
                        <FaEdit size={16} />
                    </button>
                    <button onClick={() => onDelete(event.id)} className="text-red-500 hover:text-red-700">
                        <FaTrash size={16} />
                    </button>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }}></span>
                </div>

                <p className="text-gray-600 flex items-center mt-2">
                    <FaClock className="mr-2 text-gray-500" />
                    {new Date(event.start).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                    })}{" "}
                    {event.allDay && (
                        <>
                            {new Date(event.start).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            })}{" "}
                            -{" "}
                            {new Date(event.end).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            })}
                        </>
                    )}
                </p>

                <p className="text-gray-500 flex items-center mt-2">
                    <FaCalendarAlt className="mr-2 text-gray-500" />
                    {calendarName}
                </p>
            </div>
        </div>
    );
};

export default EventDetails;
