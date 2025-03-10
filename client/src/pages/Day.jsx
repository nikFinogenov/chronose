import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import Sidebar from "../components/Sidebar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { dateStore } from "../store/dateStore";
import EventModal from "../components/EventModal";

const Day = observer(() => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        start: null,
        end: null,
        description: "",
        location: "",
        participants: [],
        color: "#000000",
    });

    const handleSelect = (selectionInfo) => {
        setNewEvent({
            title: "",
            start: selectionInfo.start,
            end: selectionInfo.end,
            description: "",
            location: "",
            participants: [],
            color: "#000000",
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

    const handleEventChange = (changeInfo) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === changeInfo.event.id
                    ? { ...event, start: changeInfo.event.start, end: changeInfo.event.end }
                    : event
            )
        );
    };

    return (
        <div className="flex h-max p-4">
            <Sidebar />
            <div className="flex-1 w-full">
                <FullCalendar
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
                        newEvent={newEvent}
                        setNewEvent={setNewEvent}
                        handleSave={handleSave}
                        setShowModal={setShowModal}
                    />
                )}
            </div>
        </div>
    );
});

export default Day;
