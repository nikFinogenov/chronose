// components/Main.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactSelect from '../components/CountrySelect';
import LoadingSpinner from '../components/LoadingSpinner';
import CalendarGrid from '../components/CalendarGrid';
import axios from 'axios';

function Main() {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const location = useLocation();
    const [country, setCountry] = useState(null);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                // Загрузка событий с API
                // const response = await axios.get(`${process.env.REACT_APP_API_URL}/events`);
                // setEvents(response.data);
            } catch (error) {
                console.error('Failed to load events:', error);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, [location]);

    const handleConfirm = () => {
        if (country) {
            axios.post(`${process.env.REACT_APP_API_URL}/events/location`, country)
                .then(response => {
                    setEvents(response.data);
                    console.log('Country submitted:', response.data);
                })
                .catch(error => {
                    console.error('Error submitting country:', error);
                });
        } else {
            console.warn('Country not selected');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex w-full px-4 mt-4">
            {/* Sidebar */}
            <div className="w-1/4 p-4 border-r border-gray-300">
                <h2 className="text-xl font-semibold mb-4">Select Country</h2>
                <ReactSelect onSelectionChange={setCountry} />
                <button className="btn btn-success mt-3 w-full" onClick={handleConfirm}>Confirm</button>
            </div>

            {/* Calendar View */}
            <div className="w-3/4">
                <CalendarGrid events={events} />
            </div>
        </div>
    );
}

export default Main;
