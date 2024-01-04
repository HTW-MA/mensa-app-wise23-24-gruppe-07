import React, {ReactElement, useState} from "react";
import "../styles/GeneralStylesheet.css";
import "../styles/UniversitySelectionPage.css"
import logo from "../resources/FoodCraft-Icon-transparent.png";
import googleMapsSearchIcon from "../resources/GoogleMaps-search-Icon.png";
import DropdownBox from "../components/DropdownBox";
import {useNavigate} from "react-router-dom";

export default function WelcomePage(): ReactElement {
    const navigate = useNavigate();
    const navigateToCampusSelection = () => {
        console.log(selectedUniversity)
        navigate('/campus-selection', {state: {university: selectedUniversity}});
    };
    const navigateToHome = () => {
        navigate('/');
    };

    const universities = [
        { label: "HTW", value: 'HTW'},
        { label: "FU", value: 'FU'},
        { label: "HU", value: 'HU'},
        { label: "BHT", value: 'BHT'},
        { label: "HWR", value: 'HWR'}
    ]

    const [selectedUniversity, setSelectedUniversity] = useState('HTW');

    const handleUniversityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUniversity(event.target.value);
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
                    options={universities}
                    defaultValue="student"
                    label="University"
                    onChange={handleUniversityChange}
                />
            </div>
            <div className="navigation-buttons">
                <button className="back-button" onClick={navigateToHome}>home</button>
                <button className="continue-button" onClick={navigateToCampusSelection}>Continue</button>
            </div>
        </div>
    );
}