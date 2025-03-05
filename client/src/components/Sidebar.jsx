import React, { useEffect } from "react";
import MicroMonth from "./MicroMonth";
// import ReactSelect from "./CountrySelect";
import { dateStore } from "../store/dateStore";
import { userStore } from "../store/userStore";
import { getUserCalendars } from "../services/userService"
// import { get } from "mobx";
// import axios from 'axios';

function Sidebar()  {
    // const [country, setCountry] = useState(null);
    // const [events, setEvents] = useState([]);
    // const handleConfirm = () => {
    //     if (country) {
    //         axios.post(`${process.env.REACT_APP_API_URL}/events/location`, country)
    //             .then(response => {
    //                 setEvents(response.data);
    //                 console.log('Country submitted:', response.data);
    //             })
    //             .catch(error => {
    //                 console.error('Error submitting country:', error);
    //             });
    //     } else {
    //         console.warn('Country not selected');
    //     }
    // };

    // const [isCountryOpen, setIsCountryOpen] = useState(false);


    useEffect(() => {
        const loadCalendars = async () => {
            try {
                // console.log(userStore.user?.id);
                const response = userStore.user ? getUserCalendars(userStore.user?.id) : null;
            } catch (error) {
                console.error('Failed to load user calendars:', error);
            }
        };
        loadCalendars();
    }, []);

    return (
        <div className="p-4 border-r border-gray-300 mb-50">
            <div>
                <p>Today is {new Date(dateStore.currentDate).toLocaleDateString()}</p>
            </div>

            <MicroMonth />
            <div className="join join-vertical bg-base-100">
                <div className="collapse collapse-arrow join-item border-base-300 border">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title font-semibold">My calendars</div>
                    {/* <div className="collapse-content text-sm">Click .</div> */}
                </div>
                <div className="collapse collapse-arrow join-item border-base-300 border">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title font-semibold">Other calendars</div>
                    {/* <div className="collapse-content text-sm">Click .</div> */}
                </div>
            </div>


            {/* <h2 className="text-xl font-semibold mt-6">Select Country</h2> */}
            {/* <ReactSelect onSelectionChange={setCountry} /> */}
            {/* <button className="btn btn-success mt-3" onClick={handleConfirm}>Confirm</button> */}
        </div>
    )
}

export default Sidebar;