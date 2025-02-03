// components/Main.jsx
import React, { useState } from 'react';
// import LoadingSpinner from '../components/LoadingSpinner';
import CalendarGrid from '../components/CalendarGrid';
import { observer } from "mobx-react-lite";

const Month = observer(() => {
    // const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    // setEvents(null);

    // if (loading) return <LoadingSpinner />;

    return (
        // <div className="flex w-full px-4 mt-4">
            // {/* Calendar View */}
            <div className="w-full px-4 mt-4">
                <CalendarGrid events={events} />
            </div>
        // </div>
    );
});

export default Month;
