import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import Sidebar from "../components/Sidebar";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { dateStore } from "../store/dateStore";

const Week = observer(() => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        start: null,
        end: null,
    });

    const handleSelect = (selectionInfo) => {
        setNewEvent({
            title: "",
            start: selectionInfo.start,
            end: selectionInfo.end,
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
                    editable: true,
                },
            ]);
            setShowModal(false);
            setNewEvent({ title: "", start: null, end: null });
        }
    };

    const handleEventChange = (changeInfo) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === changeInfo.event.id
                    ? {
                        ...event,
                        start: changeInfo.event.start,
                        end: changeInfo.event.end,
                    }
                    : event
            )
        );
    };

    return (
        <div className="flex h-max p-4">
            <Sidebar />
            <div className="w-full">
            <div className="flex-1">
                <FullCalendar
                    key={new Date(dateStore.currentDate)}
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialDate={new Date(dateStore.currentDate)}
                    initialView="timeGridWeek" // Неделя вместо дня
                    selectable={true}
                    editable={true}
                    events={events}
                    select={handleSelect}
                    eventChange={handleEventChange}
                    height="auto"
                    width="auto"
                    slotLabelFormat={{
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false, // 24-часовой формат
                    }}
                    allDaySlot={false}
                    nowIndicator={false} // Убрана красная линия текущего времени
                    weekNumbers={false} // Номера недель (можно отключить)
                    headerToolbar={{
                        left: "title",
                        center: "",
                        right: "", // Переключение вида только на неделю
                    }}
                />

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-bold mb-4">Create New Event</h2>
                            <input
                                type="text"
                                placeholder="Event Title"
                                className="border p-2 w-full mb-4"
                                value={newEvent.title}
                                onChange={(e) =>
                                    setNewEvent({ ...newEvent, title: e.target.value })
                                }
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </div>
    );
});

export default Week;
