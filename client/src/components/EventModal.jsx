import React, { useState } from "react";

const EventModal = ({ newEvent, setNewEvent, handleSave, setShowModal }) => {
    const [participantsInput, setParticipantsInput] = useState("");

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
                ...newEvent,
                participants: [...newEvent.participants, autoCompletedEmail],
            });
            setParticipantsInput("");  // Clear input field
        }
    };

    const handleDeleteParticipant = (email) => {
        setNewEvent({
            ...newEvent,
            participants: newEvent.participants.filter((participant) => participant !== email),
        });
    };

    const handleColorChange = (e) => {
        setNewEvent({ ...newEvent, color: e.target.value });
    };

    const handleSubmit = async () => {
        // Send the event data to the backend
        setShowModal(false);
        handleSave();
        // const response = await sendEventData(newEvent);
        // if (response.success) {
        //     handleSave();  // Save the event locally if backend is successful
        //     setShowModal(false);  // Close the modal
        // } else {
        //     alert("Failed to save the event. Please try again.");
        // }
    };

    // Function to send event data to backend
    const sendEventData = async (eventData) => {
        // try {
        //     const response = await fetch("/api/events", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(eventData),
        //     });
        //     return await response.json();
        // } catch (error) {
        //     console.error("Error sending event data:", error);
        //     return { success: false };
        // }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Create New Event</h2>

                {/* Event Title */}
                <input
                    type="text"
                    placeholder="Event Title"
                    className="border p-2 w-full mb-3"
                    value={newEvent.title}
                    onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                    }
                />

                {/* Event Description */}
                <textarea
                    placeholder="Event Description"
                    className="border p-2 w-full mb-3"
                    value={newEvent.description || ""}
                    onChange={(e) =>
                        setNewEvent({ ...newEvent, description: e.target.value })
                    }
                />

                {/* Participants */}
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Add participant email"
                        className="border p-2 w-full mb-2"
                        value={participantsInput}
                        onChange={(e) => setParticipantsInput(e.target.value)}
                        onKeyDown={handleAddParticipant}
                    />
                    <div>
                        {newEvent.participants.map((email, index) => (
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
                        className="w-12 h-12"
                        value={newEvent.color}
                        onChange={handleColorChange}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded"
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
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
