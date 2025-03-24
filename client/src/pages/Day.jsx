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
        type: "reminder"
    });
    const handleCloseModal = () => {
        setShowModal(false);
        setUpdating(false); // Reset updating when modal is closed
        setNewEvent({
            title: "",
            start: null,
            end: null,
            description: "",
            location: "",
            participants: [],
            color: "#34ebc6",
            type: "reminder"
        });
    };
    const renderEventContent = (eventInfo) => {
        const { type } = eventInfo.event.extendedProps;
        const { title, start, end } = eventInfo.event;
        const eventLen = Math.abs(end - start);

        const typeIcons = {
            reminder: "⏰", // Alarm clock emoji
            arrangement: "📅",  // Calendar emoji
            task: "✅",      // Checkmark emoji
        };

        // Format start and end time in 24-hour format (HH:mm)
        const formatTime = (date) => {
            return new Intl.DateTimeFormat("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // Ensures 24-hour format
            }).format(date);
        };

        return (
            <div className="flex flex-col">
                {/* <div>{`${Math.abs(end - start) < 3600000 ? Math.abs(end - start) : Math.abs(end - start)}`}</div>     */}
                <div className={`flex justify-between ${eventLen < 3600000 ? "" : "mt-2"}`} >
                    <div className={`${eventLen <= 3600000 ? "" : "flex flex-col"}`}>
                        <span className={`ml-2 ${eventLen < 3600000 ? "" : "text-xl"}`}>{title}</span>
                        <span className="ml-2">{formatTime(start)} - {formatTime(end)}</span>
                    </div>
                    <span className={`mr-4 ${eventLen < 3600000 ? "" : "text-xl"}`} >{typeIcons[type] || "📌"}</span>
                </div>
            </div>
        );
    };




    const handleCloseEventDetails = () => {
        setSelectedEvent(null);
    };
    const getTimezoneOffset = () => {
        const now = new Date();
        const offset = -now.getTimezoneOffset() / 60; // Convert minutes to hours
        const formattedOffset = `GMT${offset >= 0 ? `+${offset}` : offset}`;
        return formattedOffset;
        // setTimezoneOffset(formattedOffset);
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

            // console.log(dateStore.currentDate);

            //             const nextDay = new Date(dateStore.currentDate);
            // nextDay.setUTCDate(nextDay.getUTCDate());

            // console.log(dateStore.currentDate, " ++++ ",startOfDay," ++++ " ,startOfDay.toString());
            // console.log( new Date(dateStore.currentDate).toString());
            for (const calendar of calendarStore.calendars) {
                if (calendar.isActive) {
                    await eventStore.loadEventsForCalendar(calendar.id, startOfDay.toISOString(), endOfDay.toISOString());
                }
            }
            for (const calendar of calendarStore.invitedCalendars) {
                if (calendar.isActive) {
                    await eventStore.loadEventsForCalendar(calendar.id, startOfDay.toISOString(), endOfDay.toISOString(), true);
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

        setNewEvent({
            title: "",
            start: selectionInfo.start,
            end: selectionInfo.end,
            description: "",
            location: "",
            participants: [],
            color: "#34ebc6",
            type: "reminder"
        });
        setShowModal(true);
    };

    const handleSave = async (calendarId, repeat, zoomEnabled, meetEnabled, locationEnabled) => {
        if (newEvent.title) {
            console.log(newEvent);
            if (updating) {
                await eventStore.updateEvent(newEvent, calendarId);
            } else {
                await eventStore.createEvent({...newEvent, repeatNess: repeat, zoom: zoomEnabled, meet: meetEnabled, location: locationEnabled}, calendarId, repeat);
            }
            if(zoomEnabled){}
            if(meetEnabled){}
            if(locationEnabled){}
            setShowModal(false);
            setNewEvent({
                title: "",
                start: null,
                end: null,
                description: "",
                location: "",
                participants: [],
                color: "#000000",
                type: "reminder"
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
                        eventContent={renderEventContent}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialDate={new Date(dateStore.currentDate)}
                        initialView="timeGridDay"
                        selectable={true}
                        editable={true}
                        events={[
                            ...calendarStore.calendars,
                            ...calendarStore.invitedCalendars
                        ]
                            .filter(calendar => calendar.isActive)
                            .flatMap(calendar => eventStore.getEvents(calendar.id))
                        }
                        nowIndicator={true}
                        select={handleSelect}
                        eventChange={handleEventChange}
                        eventClick={handleEventClick}
                        // eventBorderColor="#000000"
                        height="auto"
                        slotLabelFormat={{
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        }}
                        allDaySlot={true}
                        allDayText={getTimezoneOffset()}
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
                            setShowModal={handleCloseModal}
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