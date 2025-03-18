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
import { userStore } from "../store/userStore";
import { api } from "../services";
import Swal from "sweetalert2";
import { eventStore } from "../store/eventStore";

const Day = observer(() => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [updating, setUpdating] = useState(false);
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
        setUpdating(true);
        setNewEvent(event);
        setShowModal(true);
        setSelectedEvent(null);
    };

    // Fetch events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                let newEvents = [];
                for (const calendar of calendarStore.calendars) {
                    if (!calendar.isActive) continue;
                    const response = await eventStore.loadEventsForCalendar(calendar.id);
                    newEvents = [...newEvents, ...response]; // Collect events
                }
                setEvents(newEvents); // Only update state once
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
        }, [calendarStore.calendars]); // eslint-disable-line
    // }, []); // Runs when calendars change

    const handleSelect = (selectionInfo) => {
        if (!localStorage.getItem('token')) {
            if (!calendarStore.calendars.length) {
                Swal.fire({
                    title: 'Sorry...',
                    text: 'Login to create events',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })

                return;
            }

            return;
        }

        if (userStore.user && !userStore.user.isEmailConfirmed) {
            Swal.fire({
                text: 'Confirm your email first',
                icon: 'warning',
                confirmButtonText: 'Ok'
            })

            return;
        }

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

    const handleSave = (resp) => {
        if (newEvent.title) {
            setEvents((prevEvents) => {
                const existingEventIndex = prevEvents.findIndex(event => event.id === newEvent.id);

                if (existingEventIndex !== -1) {
                    // Update the existing event
                    const updatedEvents = [...prevEvents];
                    updatedEvents[existingEventIndex] = {
                        ...prevEvents[existingEventIndex], // Keep existing properties
                        title: newEvent.title,
                        start: newEvent.start,
                        end: newEvent.end,
                        description: newEvent.description,
                        location: newEvent.location,
                        participants: newEvent.participants,
                        color: newEvent.color,
                    };
                    return updatedEvents;
                } else {
                    // Add a new event if it doesn't exist
                    return [
                        ...prevEvents,
                        {
                            // id: String(Date.now()),
                            title: newEvent.title,
                            start: newEvent.start,
                            end: newEvent.end,
                            description: newEvent.description,
                            location: newEvent.location,
                            participants: newEvent.participants,
                            color: newEvent.color,
                            editable: true,
                            calendarId: resp.calendar.id,
                            endDate: resp.endDate,
                            startDate: resp.startDate,
                            id:resp.id
                        },
                        // {
                            // calendarId
                            // +color 
                            // +description
                            // +end
                            // endDate
                            // id
                            // +start
                            // startDate
                            // +title
                        // }
                    ];
                }
            });

            setUpdating(false);
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
        console.log(events);
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === changeInfo.event.id
                    ? { ...event, start: changeInfo.event.start, end: changeInfo.event.end }
                    : event
            )
        );

        try {
            await api.patch(`/events/${changeInfo.event.id}`, changeInfo.event);
        } catch (error) {
            console.log("Error updating event data:", error);
        }
    };

    return (
        <div className="flex h-max p-4">
            <Sidebar />
            <div className="w-full">
                <div className="flex-1">
                    <FullCalendar
                        // className="calendar-container"
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
                        height="auto"
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
                            updating={updating}
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
        </div>
    );
});
export default Day;