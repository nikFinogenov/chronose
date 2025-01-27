import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactSelect from '../components/CountrySelect';
import LoadingSpinner from '../components/LoadingSpinner';
import CalendarEventsTable from '../components/CalendarEventsTable';
import kto from '../assets/kto.jpeg';
import axios from 'axios';

function Main() {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]); // Данные событий
    const location = useLocation();
    const navigate = useNavigate();
    const [country, setCountry] = useState(null);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                // Загрузка событий с API
                // const response = await axios.get(`${process.env.REACT_APP_API_URL}/events`);
                // setEvents(response.data); // Сохраняем события
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
        <div className="flex flex-col items-center pt-16 min-h-screen">
            <div className="w-full bg-purple-200 text-black p-8 text-center mb-6">
                <h1 className="text-4xl font-bold text-center">Welcome to the McOK Calendar!</h1>
                <p className="text-3xl mt-2 italic">Вы кто такие? Я вас не звал. Идите нахуй!</p>
            </div>
            <img
                src={kto}
                alt="Kto?"
                className="rounded-full mr-2"
            />
            <button className="btn btn-secondary mt-5" onClick={() => navigate('/login')}>Go to Login</button>
            <div className="mt-6">
                <ReactSelect onSelectionChange={setCountry} />
                <button className="btn btn-success mt-3" onClick={handleConfirm}>Confirm</button>
            </div>
            <div className="mt-10 w-full px-4">
                <h2 className="text-2xl font-semibold mb-4">Events</h2>
                {events.length != 0 && <CalendarEventsTable events={events} />}
            </div>
        </div>
    );
}

export default Main;
