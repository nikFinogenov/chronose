import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import Sidebar from "../components/Sidebar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const Day = observer(() => {
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
      <div className="flex-1">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          selectable={true}
          editable={true}
          events={events}
          select={handleSelect}
          eventChange={handleEventChange} // Update events on drag or resize
          height="auto"
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
  );
});

export default Day;
