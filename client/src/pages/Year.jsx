import React from "react";
import { observer } from "mobx-react-lite";
import MicroMonth from "../components/MicroMonth";
import Sidebar from "../components/Sidebar";

const Year = observer(() => {
    return (
        <div className="flex h-max p-4">
            <Sidebar />
            <div className="flex flex-wrap gap-4 justify-around">
                <MicroMonth month="01" />
                <MicroMonth month="02" />
                <MicroMonth month="03" />
                <MicroMonth month="04" />
                <MicroMonth month="05" />
                <MicroMonth month="06" />
                <MicroMonth month="07" />
                <MicroMonth month="08" />
                <MicroMonth month="09" />
                <MicroMonth month="10" />
                <MicroMonth month="11" />
                <MicroMonth month="12" />
            </div>
        </div>
    );
});

export default Year;
