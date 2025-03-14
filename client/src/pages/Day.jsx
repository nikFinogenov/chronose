import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import Sidebar from "../components/Sidebar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { dateStore } from "../store/dateStore";
import EventModal from "../components/EventModal";
import EventDetails from "../components/EventDetails";
import { calendarStore } from "../store/calendarStore";
import { api } from "../services";

const Day = observer(() => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: "",
        start: null,
        end: null,
        description: "",
        location: "",
        participants: [],
        color: "#34ebc6",
    });

    const handleCloseEventDetails = () => {
        setSelectedEvent(null);
    };

    const handleEditEvent = (event) => {
        setNewEvent(event);
        setShowModal(true);
        setSelectedEvent(null);
    };

    // Fetch events for all calendars
    useEffect(() => {
        const fetchEvents = async () => {
            if (!calendarStore.calendars.length) return;

            try {
                const allEvents = [];
                for (const calendar of calendarStore.calendars) {
                    const response = await api.get(`/events/calendar/${calendar.id}`);
                    if (response.data && Array.isArray(response.data)) {
                        allEvents.push(
                            ...response.data.map((event) => ({
                                id: event.id,
                                title: event.title,
                                start: new Date(event.startDate),
                                end: new Date(event.endDate),
                                description: event.description,
                                location: event.location,
                                participants: event.participants || [],
                                color: event.color || "#000000",
                                calendarId: calendar.id, // Track which calendar the event belongs to
                            }))
                        );
                    }
                }
                setEvents(allEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, [calendarStore.calendars]); // Runs when calendars change

    const handleSelect = (selectionInfo) => {
        setNewEvent({
            title: "",
            start: selectionInfo.start,
            end: selectionInfo.end,
            description: "",
            location: "",
            participants: [],
            color: "#34ebc6",
        });
        setShowModal(true);
    };

    const handleSave = () => {
        if (newEvent.title) {
            setEvents((prevEvents) => [
                ...prevEvents,
                {
                    id: String(Date.now()),
                    title: newEvent.title,
                    start: newEvent.start,
                    end: newEvent.end,
                    description: newEvent.description,
                    location: newEvent.location,
                    participants: newEvent.participants,
                    color: newEvent.color,
                    editable: true,
                },
            ]);
            setShowModal(false);
            setNewEvent({
                title: "",
                start: null,
                end: null,
                description: "",
                location: "",
                participants: [],
                color: "#000000",
            });
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await api.delete(`/events/${eventId}`);
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
            setSelectedEvent(null);
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const handleEventClick = (clickInfo) => {
        setSelectedEvent({
            id: clickInfo.event.id,
            title: clickInfo.event.title,
            start: clickInfo.event.start,
            end: clickInfo.event.end,
            description: clickInfo.event.extendedProps.description || "",
            location: clickInfo.event.extendedProps.location || "",
            participants: clickInfo.event.extendedProps.participants || [],
            color: clickInfo.event.backgroundColor || "#000000",
            calendarId: clickInfo.event.extendedProps.calendarId || "Unknown",
        });
    };

    const handleEventChange = async (changeInfo) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === changeInfo.event.id
                    ? { ...event, start: changeInfo.event.start, end: changeInfo.event.end }
                    : event
            )
        );

        try {
            const response = await api.patch(`/events/${changeInfo.event.id}`, changeInfo.event);
        } catch (error) {
            console.log("Error updating event data:", error);
        }
    };

    return (
        <div className="flex h-max p-4">
            <Sidebar />
            <div className="flex-1 w-full">
                <FullCalendar
                    className="calendar-container"
                    key={new Date(dateStore.currentDate)}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialDate={new Date(dateStore.currentDate)}
                    initialView="timeGridDay"
                    selectable={true}
                    editable={true}
                    events={events}
                    nowIndicator={true}
                    select={handleSelect}
                    eventChange={handleEventChange}
                    eventClick={handleEventClick}
                    height="100%"
                    slotLabelFormat={{
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    }}
                    allDaySlot={false}
                    // allDayText="GMT+01"
                    slotLabelContent={(arg) => (
                        <div className="relative">
                            {arg.text}
                            {arg.time.hour === 0 && arg.time.minute === 0 && (
                                <div className="absolute -top-5 left-0 text-sm font-semibold text-gray-500">
                                    GMT+01
                                </div>
                            )}
                        </div>
                    )}
                    headerToolbar={{
                        left: "title",
                        center: "",
                        right: "",
                    }}
                />

                {showModal && (
                    <EventModal
                        event={newEvent}
                        setNewEvent={setNewEvent}
                        handleSave={handleSave}
                        setShowModal={setShowModal}
                    />
                )}

                {selectedEvent && (
                    <EventDetails
                        event={selectedEvent}
                        onClose={handleCloseEventDetails}
                        onEdit={handleEditEvent}
                        onDelete={handleDeleteEvent}
                    />
                )}
            </div>
        </div>
    );
});

export default Day;
