import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dateStore } from "../store/dateStore";

function Header() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("Month"); // По умолчанию "Month"

  const handleNavigation = (view) => {
    setActiveView(view);
    navigate(`/${view.toLowerCase()}`);
  };

  return (
    <div className="w-full flex justify-between items-center bg-purple-200 text-black p-4 shadow-md">
      {/* <h1 className="text-3xl font-bold">McOK Calendar</h1> */}
      <h1 className="text-2xl font-bold ml-4 sm:block hidden">
        <Link to="/">CloOk Calendar</Link>
      </h1>
      <div className="flex items-center">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn m-1">
            {activeView}
          </div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {["Day", "Week", "Month", "Year"].map((view) => (
              <li key={view}>
                <p
                  className={`cursor-pointer p-2 rounded ${activeView === view ? "bg-purple-300" : "hover:bg-purple-100"
                    }`}
                  onClick={() => handleNavigation(view)}
                >
                  {view}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <button className="btn btn-primary mr-2" onClick={() => dateStore.prevDay()}>
          &lt; Prev day
        </button>
        <button className="btn btn-primary ml-2" onClick={() => dateStore.nextDay()}>
          Next day &gt;
        </button>
        <button className="btn btn-primary ml-2" onClick={() => dateStore.today()}>
          TODAY
        </button>
        <button className="btn btn-secondary ml-4" onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default Header;
