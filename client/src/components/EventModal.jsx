import React, { useState, useEffect } from "react";
import { calendarStore } from "../store/calendarStore";
// import { eventStore } from "../store/eventStore";

const EventModal = ({ event, setNewEvent, handleSave, setShowModal, updating = false }) => {
    const [selectedCalendar, setSelectedCalendar] = useState(event.calendarId || null);
    const [participantsInput, setParticipantsInput] = useState("");
    const [eventType, setEventType] = useState(event.type || "reminder");
    const [repeatEnabled, setRepeatEnabled] = useState(false);
    const [repeatInterval, setRepeatInterval] = useState("day");
    const [allDay, setAllDay] = useState(false);

    useEffect(() => {
        if (calendarStore.calendars.length === 1) {
            setSelectedCalendar(calendarStore.calendars[0].id);
        }
    }, []);

    const handleCalendarChange = (e) => setSelectedCalendar(e.target.value);
    const handleEmailAutoComplete = (email) => {
        if (!email.includes("@")) {
            return `${email}@gmail.com`;  // Automatically append @gmail.com
        }
        return email;
    };
    const handleColorChange = (e) => setNewEvent({ ...event, color: e.target.value });
    const handleEventTypeChange = (type) => {
        setEventType(type);
        setNewEvent({ ...event, type });
        if (type === "arrangement") {
            setSelectedCalendar(calendarStore.calendars[0].id); // Default calendar
        }
    };
    const handleAddParticipant = (e) => {
        if (e.key === "Enter") {
            setNewEvent({
                ...event,
                participants: [...(event.participants || []), handleEmailAutoComplete(participantsInput.trim())],
            });
            setParticipantsInput("");
        }
    };
    const handleDeleteParticipant = (email) => {
        setNewEvent({
            ...event,
            participants: event.participants.filter((participant) => participant !== email),
        });
    };
    const formatLocalDate = (dateString) => {
        const date = new Date(dateString);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
    };
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`; // Correct format for input type="date"
    };
    const handleSubmit = () => {
        if (!event.title || event.title === "") return;
        if (allDay) {
            // console.log("penis drochim")
            // setNewEvent({ ...event, end: event.start })// Ensure end = start
            // setNewEvent({...event, end: event.start}); 
            event.end = event.start;
            event.allDay = true;
        }
        // console.log()
        setShowModal(false);
        handleSave(selectedCalendar, repeatEnabled ? repeatInterval : null);
        // console.log(event);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="flex justify-between">
                    <h2 className="text-lg font-bold mb-4">{updating ? "Edit Event" : "Create New Event"}</h2>
                    <input type="color" className="w-7 h-7" value={event.color} onChange={handleColorChange} />
                </div>
                {!updating && (
                    calendarStore.calendars.length > 1 && (
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
                    )
                )}

                <div className="flex mb-4 bg-gray-200 p-1 rounded-full">
                    {["reminder", "task", "arrangement"].map((type) => (
                        <button
                            key={type}
                            className={`flex-1 py-1 rounded-full transition-all ${eventType === type ? "bg-blue-500 text-white" : "bg-transparent"}`}
                            onClick={() => handleEventTypeChange(type)}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                <input type="text" placeholder="Event Title" className="border p-1.5 w-full mb-3"
                    value={event.title} onChange={(e) => setNewEvent({ ...event, title: e.target.value })} />

                {eventType !== "arrangement" && (
                    <div className="flex items-center mb-3">
                        <input type="checkbox" checked={allDay} onChange={() => setAllDay(!allDay)} className="mr-2" />
                        <span>All Day</span>
                    </div>
                )}

                {/* {!allDay && ( */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Start:</label>
                    <input
                        type={allDay ? "date" : "datetime-local"}
                        className="border p-1.5 w-full mb-3"
                        value={event.start ? (allDay ? formatDate(event.start) : formatLocalDate(event.start)) : ""}
                        onChange={(e) => setNewEvent({ ...event, start: new Date(e.target.value) })}
                    />
                    {eventType !== "task" && !allDay && (
                        <>
                            <label className="block text-sm font-medium text-gray-700">End:</label>
                            <input
                                type="datetime-local"
                                className="border p-1.5 w-full mb-3"
                                value={event.end ? formatLocalDate(event.end) : ""}
                                onChange={(e) => setNewEvent({ ...event, end: new Date(e.target.value) })}
                            />
                        </>
                    )}
                </div>
                {/* )} */}


                {(eventType === "reminder" || eventType === "task") && (
                    <>
                        <textarea placeholder="Click to enter description" className="border p-1.5 w-full mb-3"
                            value={event.description || ""} onChange={(e) => setNewEvent({ ...event, description: e.target.value })} />
                        <div className="mb-3">
                            {
                                !updating && (<>
                                    <label className="flex items-center">
                                        <input type="checkbox" checked={repeatEnabled} onChange={() => setRepeatEnabled(!repeatEnabled)} className="mr-2" />
                                        Repeat Event
                                    </label>
                                    {repeatEnabled && (
                                        <select className="border p-2 w-full mt-2" value={repeatInterval} onChange={(e) => setRepeatInterval(e.target.value)}>
                                            <option value="day">Daily</option>
                                            <option value="week">Weekly</option>
                                            <option value="month">Monthly</option>
                                            <option value="year">Yearly</option>
                                        </select>
                                    )}
                                </>)
                            }
                            {/* <label className="flex items-center">
                                <input type="checkbox" checked={repeatEnabled} onChange={() => setRepeatEnabled(!repeatEnabled)} className="mr-2" />
                                Repeat Event
                            </label>
                            {repeatEnabled && (
                                <select className="border p-2 w-full mt-2" value={repeatInterval} onChange={(e) => setRepeatInterval(e.target.value)}>
                                    <option value="day">Daily</option>
                                    <option value="week">Weekly</option>
                                    <option value="month">Monthly</option>
                                    <option value="year">Yearly</option>
                                </select>
                            )} */}
                        </div>
                    </>
                )}

                {eventType === "arrangement" && (
                    <div className="mb-3">
                        <input type="text" placeholder="Add participant email" className="border p-1.5 w-full mb-2"
                            value={participantsInput} onChange={(e) => setParticipantsInput(e.target.value)}
                            onKeyDown={handleAddParticipant} />
                        <div>
                            {event.participants?.map((email, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-2">
                                    <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-sm">{email}</span>
                                    <button className="text-red-500" onClick={() => handleDeleteParticipant(email)}>&#10005;</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-5">
                    <button className="px-4 py-1 bg-gray-300 rounded" onClick={() => {
                        setShowModal(false);
                    }}>Cancel</button>
                    <button className="px-4 py-1 bg-blue-500 text-white rounded" onClick={handleSubmit}>Save</button>
                </div>
            </div>
        </div>
    );
};
export default EventModal;
