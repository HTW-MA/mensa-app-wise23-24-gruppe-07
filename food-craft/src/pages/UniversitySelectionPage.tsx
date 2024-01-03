import React, {ReactElement} from "react";
import "../styles/GeneralStylesheet.css";
import "../styles/UniversitySelectionPage.css"
import logo from "../ressources/FoodCraft-Icon-transparent.png";
import googleMapsSearchIcon from "../ressources/GoogleMaps-search-Icon.png";
import DropdownBox from "../components/DropdownBox";
import {useNavigate} from "react-router-dom";

export default function WelcomePage(): ReactElement {
    const roles = [
        { label: "HTW Berlin", value: 'htw-berlin'}
    ]

    const navigate = useNavigate();

    const navigateToCampusSelection = () => {
        navigate('/campus-selection');
    };
    const navigateToHome = () => {
        navigate('/');
    };

    return (
        <div className="page">
            <header>
                <img src={logo} className="food-craft-icon" alt="( )"/>
                <h1 className="heading">MealCraft</h1>
                <h2 className="sub-heading">Select University</h2>
            </header>
            <div>
                <img src={googleMapsSearchIcon} className="google-maps-search-icon" alt="( )"/>
            </div>
            <div>
                <p className="or-paragraph">or</p>
            </div>
            <div className="dropdown-box">
                <DropdownBox
                    name="cars"
                    options={roles}
                    defaultValue="student"
                    label="University"
                />
            </div>
            <div className="navigation-buttons">
                <button className="back-button" onClick={navigateToHome}>&lt; home</button>
                <button className="continue-button" onClick={navigateToCampusSelection}>Continue &gt;</button>
            </div>
        </div>
    );
}