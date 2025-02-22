import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import MicroMonth from "../components/MicroMonth"

const Year = observer(() => {
    return (
        <div className="flex flex-col">
            <div className="flex">
                <MicroMonth month={"01"} />
                <MicroMonth month={"02"} />
                <MicroMonth month={"03"} />
                <MicroMonth month={"04"} />
            </div>

            <div className="flex">
                <MicroMonth month={"05"} />
                <MicroMonth month={"06"} />
                <MicroMonth month={"07"} />
                <MicroMonth month={"08"} />
            </div>

            <div className="flex">
                <MicroMonth month={"09"} />
                <MicroMonth month={"10"} />
                <MicroMonth month={"11"} />
                <MicroMonth month={"12"} />
            </div>
        </div>
    )
});

export default Year;