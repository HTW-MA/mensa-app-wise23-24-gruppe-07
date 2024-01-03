import React, {ReactElement} from "react";
import {useNavigate} from "react-router-dom";
import "../styles/Homepage.css";
import logo from "../resources/FoodCraft-Icon-transparent.png";

export default function Homepage(): ReactElement {

    const navigate = useNavigate();

    return (
        <div className="homepage">
            <header className="header">
                <div className="header-tags">
                    <p className="speiseplan-tag">Speiseplan</p>
                    <div className="date-selector">
                        <button>&lt;</button>
                        <p className="datum">04.12.2023 - 08.12.2023</p>
                        <button>&gt;</button>
                    </div>
                </div>
                <img src={logo} className="logo"/>
            </header>
        </div>
    );
}