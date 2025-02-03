// components/Main.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import CalendarGrid from '../components/CalendarGrid';
import { observer } from "mobx-react-lite";

const Main = observer(() => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const loadEvents = async () => {
            try {
                // Загрузка событий с API
                // const response = await axios.get(`${process.env.REACT_APP_API_URL}/events`);
                setEvents(null);
            } catch (error) {
                console.error('Failed to load events:', error);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, [location]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex w-full px-4 mt-4">
            {/* Calendar View */}
            <div className="w-3/4">
                <CalendarGrid events={events} />
            </div>
        </div>
    );
});

export default Main;
