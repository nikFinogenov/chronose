import React, { useState, useEffect } from "react";
import { calendarStore } from "../store/calendarStore";
import { api } from "../services";

const EventModal = ({ event, setNewEvent, handleSave, setShowModal }) => {
    const [participantsInput, setParticipantsInput] = useState("");
    const [selectedCalendar, setSelectedCalendar] = useState(null);

    useEffect(() => {
        if (calendarStore.calendars.length === 1) {
            setSelectedCalendar(calendarStore.calendars[0].id);
        }
    }, []);

    const handleCalendarChange = (e) => {
        const calendarId = parseInt(e.target.value, 10);
        setSelectedCalendar(calendarId);
    };

    const isValidEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleEmailAutoComplete = (email) => {
        if (!email.includes("@")) {
            return `${email}@gmail.com`;  // Automatically append @gmail.com
        }
        return email;
    };

    const handleAddParticipant = (e) => {
        if (e.key === "Enter") {
            const autoCompletedEmail = handleEmailAutoComplete(participantsInput.trim());
            setNewEvent({
                ...event,
                participants: [...event.participants, autoCompletedEmail],
            });
            setParticipantsInput("");  // Clear input field
        }
    };

    const handleDeleteParticipant = (email) => {
        setNewEvent({
            ...event,
            participants: event.participants.filter((participant) => participant !== email),
        });
    };

    const handleColorChange = (e) => {
        setNewEvent({ ...event, color: e.target.value });
    };

    const handleSubmit = async () => {

        if (!event.title || event.title === "") return;
        // Send the event data to the backend
        setShowModal(false);
        handleSave();

        try {
            const response = await api.post(`/events/calendar/${selectedCalendar}`, event);
        } catch (error) {
            console.log("Error sending event data:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Create New Event</h2>

                {/* Calendar Selection */}
                {calendarStore.calendars.length > 1 && (
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700">Select Calendar:</label>
                        <select
                            className="border p-2 w-full"
                            value={selectedCalendar || ""}
                            onChange={handleCalendarChange}
                        >
                            <option value="" disabled>Select a calendar</option>
                            {calendarStore.calendars.map((calendar) => (
                                <option key={calendar.id} value={calendar.id}>
                                    {calendar.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Event Title */}
                <input
                    type="text"
                    placeholder="Event Title"
                    className="border p-1.5 w-full mb-3"
                    value={event.title}
                    onChange={(e) =>
                        setNewEvent({ ...event, title: e.target.value })
                    }
                />

                {/* Event Type Selection */}
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">Event Type:</label>
                    <select
                        className="border p-1.5 w-full"
                        value={event.type || "event"}
                        onChange={(e) => setNewEvent({ ...event, type: e.target.value })}
                    >
                        <option value="event">Event</option>
                        <option value="task">Task</option>
                        <option value="reminder">Reminder</option>
                    </select>
                </div>


                {/* Event Description */}
                <textarea
                    placeholder="Event Description"
                    className="border p-1.5 w-full mb-3"
                    value={event.description || ""}
                    onChange={(e) =>
                        setNewEvent({ ...event, description: e.target.value })
                    }
                />

                {/* Start Date */}
                <label className="block text-sm font-medium text-gray-700">Start Date & Time:</label>
                <input
                    type="datetime-local"
                    className="border p-1.5 w-full mb-3"
                    value={event.start ? new Date(event.start).toISOString().slice(0, 16) : ""}
                    onChange={(e) => setNewEvent({ ...event, start: new Date(e.target.value) })}
                />

                {/* End Date */}
                <label className="block text-sm font-medium text-gray-700">End Date & Time:</label>
                <input
                    type="datetime-local"
                    className="border p-1.5 w-full mb-3"
                    value={event.end ? new Date(event.end).toISOString().slice(0, 16) : ""}
                    onChange={(e) => setNewEvent({ ...event, end: new Date(e.target.value) })}
                />


                {/* Participants */}
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Add participant email"
                        className="border p-1.5 w-full mb-2"
                        value={participantsInput}
                        onChange={(e) => setParticipantsInput(e.target.value)}
                        onKeyDown={handleAddParticipant}
                    />
                    <div>
                        {event.participants.map((email, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <span className="inline-block bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-sm">
                                    {email}
                                </span>
                                <button
                                    className="text-red-500"
                                    onClick={() => handleDeleteParticipant(email)}
                                >
                                    &#10005; {/* Cross icon */}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Event Color */}
                <div className="mb-4">
                    <input
                        type="color"
                        id="colorPicker"
                        className="w-7 h-7"
                        value={event.color}
                        onChange={handleColorChange}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-5">
                    <button
                        className="px-4 py-1 bg-gray-300 rounded"
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-1 bg-blue-500 text-white rounded"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
