import React, { useState } from "react";
import MicroMonth from "./MicroMonth";
import ReactSelect from "./CountrySelect";
import { dateStore } from "../store/dateStore";
import axios from 'axios';

function Sidebar() {
    const [country, setCountry] = useState(null);
    const [events, setEvents] = useState([]);
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

    return (
        <div className="w-1/4 p-4 border-r border-gray-300">
            <div>
                <p>Today is {new Date(dateStore.currentDate).toLocaleDateString()}</p>
            </div>

            <MicroMonth />

            <h2 className="text-xl font-semibold mb-4">Select Country</h2>
            <ReactSelect onSelectionChange={setCountry} />
            <button className="btn btn-success mt-3 w-full" onClick={handleConfirm}>Confirm</button>
        </div>
    )
}

export default Sidebar;