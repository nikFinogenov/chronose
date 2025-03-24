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
import Swal from "sweetalert2";
import { eventStore } from "../store/eventStore";

const Day = observer(() => {
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

    // Fetch events when the component mounts or when calendars change
    useEffect(() => {
        const fetchEvents = async () => {
            const endOfDay = new Date(dateStore.currentDate);
            endOfDay.setHours(23, 59, 0, 0);
            const startOfDay = new Date(dateStore.currentDate);
            startOfDay.setHours(0, 0, 0, 0);

            console.log(dateStore.currentDate);
            for (const calendar of calendarStore.calendars) {
                if (calendar.isActive) {
                    await eventStore.loadEventsForCalendar(calendar.id, startOfDay.toISOString(), endOfDay.toISOString());
                }
            }
            for (const calendar of calendarStore.invitedCalendars) {
                if (calendar.isActive) {
                    await eventStore.loadEventsForCalendar(calendar.id, startOfDay.toISOString(), endOfDay.toISOString());
                }
            }
        };

        fetchEvents();
    }, [dateStore.currentDate, calendarStore.calendars]); //eslint-disable-line

    const handleSelect = (selectionInfo) => {
        if (!localStorage.getItem('token')) {
            if (!calendarStore.calendars.length) {
                Swal.fire({
                    title: 'Sorry...',
                    text: 'Login to create events',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                return;
            }

            return;
        }

        if (userStore.user && !userStore.user.isEmailConfirmed) {
            Swal.fire({
                text: 'Confirm your email first',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
            return;
        }

        setUpdating(false);

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

    const handleSave = async (calendarId) => {
        if (newEvent.title) {
            if (updating) {
                await eventStore.updateEvent(newEvent, calendarId);
                if (newEvent.calendarId && newEvent.participants.length > 0) {
                    for (const { email, role } of newEvent.participants) {
                        try {
                            await eventStore.inviteUser(newEvent.id, email, role);
                            console.log(`User ${email} invited as ${role} to event ${newEvent.id}`);
                        } catch (error) {
                            console.error(`Failed to invite ${email} as ${role}:`, error);
                        }
                    }
                }
            } else {
                await eventStore.createEvent(newEvent, calendarId);
            }

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
        const calendarId = eventStore.getEventCalendarId(eventId);
        if (calendarId) {
            await eventStore.deleteEvent(eventId, calendarId);
            setSelectedEvent(null);
        }
    };

    const handleEventClick = (clickInfo) => {
        const event = clickInfo.event;
        setSelectedEvent({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            description: event.extendedProps.description || "",
            location: event.extendedProps.location || "",
            participants: event.extendedProps.participants || [],
            color: event.backgroundColor || "#000000",
            calendarId: event.extendedProps.calendarId || "Unknown",
        });
    };

    const handleEventChange = async (changeInfo) => {
        await eventStore.updateEvent({
            id: changeInfo.event.id,
            start: changeInfo.event.start,
            end: changeInfo.event.end,
        }, eventStore.getEventCalendarId(changeInfo.event.id));
    };

    // Get events for the active calendar
    // const events = 

    return (
        <div className="flex h-max p-4">
            <Sidebar />
            <div className="w-full">
                <div className="flex-1">
                    <FullCalendar
                        key={new Date(dateStore.currentDate)}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialDate={new Date(dateStore.currentDate)}
                        initialView="timeGridDay"
                        selectable={true}
                        editable={true}
                        events={calendarStore.calendars
                            .filter(calendar => calendar.isActive)
                            .flatMap(calendar =>
                                eventStore.getEvents(calendar.id).map(event => ({
                                    ...event,
                                    borderColor: calendar.color, // Optional: Match border color
                                    classNames: ['left-border-event', 'pading-left'], // Add custom class
                                }))
                            )}
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