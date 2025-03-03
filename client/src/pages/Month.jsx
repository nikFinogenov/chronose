// components/Main.jsx
import React, { useState, useEffect } from 'react';
// import LoadingSpinner from '../components/LoadingSpinner';
import CalendarGrid from '../components/CalendarGrid';
import Sidebar from '../components/Sidebar';
import { observer } from "mobx-react-lite";
import { dateStore } from '../store/dateStore';

const Month = observer(() => {
    // const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    // setEvents(null);
    // useEffect(() => {
    // setEvents([]);
    // }, [events]);

    // if (loading) return <LoadingSpinner />;

    return (
        <div className="flex w-full px-4 mt-4">
            <Sidebar />
            <div className="w-full">
                <h1 className="text-3xl mb-5">{new Date(dateStore.currentDate).toLocaleString('default', { month: 'long' }) + ' ' +new Date(dateStore.currentDate).getFullYear()}</h1>
                {/* {setEvents([])} */}
                <CalendarGrid events={events} month={new Date(dateStore.currentDate).getMonth()} year={new Date(dateStore.currentDate).getFullYear()} />
            </div>
        </div>
    );
});

export default Month;
