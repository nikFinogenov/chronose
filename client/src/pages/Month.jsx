// components/Main.jsx
import React, { useState } from 'react';
// import LoadingSpinner from '../components/LoadingSpinner';
import CalendarGrid from '../components/CalendarGrid';
import Sidebar from '../components/Sidebar';
import { observer } from "mobx-react-lite";

const Month = observer(() => {
    // const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    // setEvents(null);

    // if (loading) return <LoadingSpinner />;

    return (
        <div className="flex w-full px-4 mt-4">
            <Sidebar />
            <div className="w-full">
                {setEvents([])}
                <CalendarGrid events={events} />
            </div>
        </div>
    );
});

export default Month;
