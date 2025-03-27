import React from "react";
import { observer } from "mobx-react-lite";
import MicroMonth from "../components/MicroMonth";
import Sidebar from "../components/Sidebar";
import { dateStore } from "../store/dateStore";

const Year = observer(() => {
  return (
    <div className="flex h-max p-4">
      <Sidebar />
      <div className="m-5 w-full">
        <div className="flex flex-col flex-1 items-center">
          <h1 className="text-3xl mb-5">{new Date(dateStore.currentDate).getFullYear()}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-center">
            {Array.from({ length: 12 }, (_, i) => (
              <MicroMonth key={i + 1} month={(i + 1).toString().padStart(2, "0")} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Year;
