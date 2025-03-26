import React, { useState, useEffect } from "react";
import { calendarStore } from "../store/calendarStore";
import { eventStore } from "../store/eventStore";

const EventModal = ({ event, setNewEvent, handleSave, setShowModal, updating = false }) => {
	const [selectedCalendar, setSelectedCalendar] = useState(event.calendarId || (calendarStore.calendars.length > 0 ? calendarStore.calendars[0].id : null));
	const [participantsInput, setParticipantsInput] = useState("");
	const [eventType, setEventType] = useState(event.type || "reminder");
	const [repeatEnabled, setRepeatEnabled] = useState(false);
	const [repeatInterval, setRepeatInterval] = useState("day");
	const [allDay, setAllDay] = useState(event.end ? false : true);
	const [zoomEnabled, setZoomEnabled] = useState(false);
	const [locationEnabled, setLocationEnabled] = useState(false);
	const [address, setAddress] = useState(event.address || ""); // Address state
	const [showMap, setShowMap] = useState(false); // Control map visibility
	// const [meetEnabled, setMeetEnabled] = useState(false);

	useEffect(() => {
		if (calendarStore.calendars.length === 1) {
			setSelectedCalendar(calendarStore.calendars[0].id);
		}
	}, []);
	// const handleCalendarChange = (e) => setSelectedCalendar(e.target.value);
	const handleCalendarChange = e => {
		const calendarId = e.target.value;
		setSelectedCalendar(calendarId);
	};
	const handleColorChange = e => {
		setNewEvent({ ...event, color: e.target.value });
	};
	const handleEmailAutoComplete = (email) => {
		if (!email.includes("@")) {
			return `${email}@gmail.com`;  // Automatically append @gmail.com
		}
		return email;
	};
	const handleEventTypeChange = (type) => {
		setEventType(type);
		setNewEvent({ ...event, type });
		if (type === "arrangement") {
			setSelectedCalendar(calendarStore.calendars[0].id); // Default calendar
		}
	};
	const handleAddParticipant = e => {
		if (e.key === 'Enter') {
			const email = participantsInput.trim();
			if (isValidEmail(email)) {
				setNewEvent({
					...event,
					participants: [...event.participants, { email, role: 'viewer' }],
				});
				setParticipantsInput('');
			}
		}
	};
	const handleDeleteParticipant = email => {
		setNewEvent({
			...event,
			participants: event.participants.filter(participant => participant.email !== email),
		});
	};
	const handleAddressChange = (e) => {
		setAddress(e.target.value);
		setNewEvent({ ...event, address: e.target.value });
	};
	const formatLocalDate = (dateString) => {
		const date = new Date(dateString);
		return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
			.toISOString()
			.slice(0, 16);
	};
	const handleRoleChange = (email, newRole) => {
		setNewEvent({
			...event,
			participants: event.participants.map(participant => (participant.email === email ? { ...participant, role: newRole } : participant)),
		});
	};
	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`; // Correct format for input type="date"
	};
	// const handleSubmit = () => {
	//     if (!event.title || event.title === "") return;
	//     if (allDay) {
	//         event.end = event.start;
	//         event.allDay = true;
	//     }
	//     setShowModal(false);        
	// };
	const handleSubmit = async () => {
		if (!event.title || event.title === '') {
			event.title = "(No Title)"
		}
		if (allDay) {
			event.end = event.start;
			event.allDay = true;
		}

		if (updating) {
			// eventStore.updateEvent(event, selectedCalendar);
			if (event.calendarId && event.participants.length > 0) {
				for (const { email, role } of event.participants) {
					try {
						await eventStore.inviteUser(event.id, email, role);
						console.log(`User ${email} invited as ${role} to event ${event.id}`);
					} catch (error) {
						console.error(`Failed to invite ${email} as ${role}:`, error);
					}
				}
			}
		} else {
			// response = await eventStore.createEvent(event, selectedCalendar);
		}
		setShowModal(false);
		// handleSave(response);
		handleSave(selectedCalendar, repeatEnabled ? repeatInterval : null, zoomEnabled, locationEnabled ? address : locationEnabled);
	};
	const isValidEmail = email => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
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
					<label className="block text-sm font-medium text-gray-700">{allDay ? "Start Date:" : "Start Date & Time:"}</label>
					<input
						type={allDay ? "date" : "datetime-local"}
						className="border p-1.5 w-full mb-3"
						value={event.start ? (allDay ? formatDate(event.start) : formatLocalDate(event.start)) : ""}
						onChange={(e) => setNewEvent({ ...event, start: new Date(e.target.value) })}
					/>
					{eventType !== "task" && !allDay && (
						<>
							<label className="block text-sm font-medium text-gray-700">End Date & Time:</label>
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

				<label className='block text-sm font-medium text-gray-700'>Categories</label>
				<div className='flex flex-wrap gap-2 mb-4'>
					<label className='flex items-center'>
						<input type='checkbox' className='mr-2 checkbox checkbox-primary' />
						Work
					</label>
					<label className='flex items-center'>
						<input type='checkbox' className='mr-2 checkbox checkbox-primary' />
						Rest
					</label>
					<label className='flex items-center'>
						<input type='checkbox' className='mr-2 checkbox checkbox-primary' />
						Study
					</label>
				</div>

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
						</div>
					</>
				)}
				{(eventType === "reminder" || eventType === "arrangement") && (
					<div className='mb-3'>
						<input
							type='text'
							placeholder='Add participant email'
							className='border p-1.5 w-full mb-2'
							value={participantsInput}
							onChange={e => setParticipantsInput(e.target.value)}
							onKeyDown={handleAddParticipant}
						/>
						<div>
							{event.participants.map((participant, index) => (
								<div key={index} className='flex items-center justify-between mb-2'>
									<span className='px-2 py-1 text-sm text-gray-700 bg-gray-200 rounded-full'>{participant.email}</span>
									<select className='p-1 border rounded' value={participant.role} onChange={e => handleRoleChange(participant.email, e.target.value)}>
										<option value='editor'>Editor</option>
										<option value='viewer'>Viewer</option>
										<option value='manager'>Manager</option>
									</select>
									<button className='text-red-500' onClick={() => handleDeleteParticipant(participant.email)}>
										&#10005;
									</button>
								</div>
							))}
						</div>
					</div>
				)}
				{eventType === "arrangement" && !updating && (
					<div className="flex justify-between" >
						<label>
							<input type="checkbox" checked={zoomEnabled} onChange={() => setZoomEnabled(!zoomEnabled)} className="mr-1" />
							Generate Zoom call
						</label>
						<label>
							<input type="checkbox" checked={locationEnabled} onChange={() => setLocationEnabled(!locationEnabled)} className="mr-1" />
							Location
						</label>
					</div>
				)}
				{locationEnabled && (
					<div>
						<div className="mb-3">
							<label className="block text-sm font-medium text-gray-700">Address:</label>
							<input
								type="text"
								placeholder="Enter address"
								className="border p-1.5 w-full"
								value={address}
								onChange={handleAddressChange}
							/>
							<p
								className="text-blue-500 cursor-pointer text-sm mt-1"
								onClick={() => setShowMap(true)}
							>
								Show on map
							</p>
						</div>
						{showMap && address && (
							<div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
								<div className="bg-white p-6 rounded-lg shadow-lg w-[800px] h-[650px] relative">
									<button
										className="absolute top-2 right-2 text-gray-700"
										onClick={() => setShowMap(false)}
									>
										✖
									</button>
									<iframe
										width="100%"
										height="100%"
										loading="lazy"
										allowFullScreen
										referrerPolicy="no-referrer-when-downgrade"
										src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API}&q=${encodeURIComponent(address)}`}
									></iframe>
								</div>
							</div>
						)}
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
