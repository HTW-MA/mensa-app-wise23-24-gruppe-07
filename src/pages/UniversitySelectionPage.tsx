import React, {ReactElement, useState} from "react";
import "../styles/GeneralStylesheet.css";
import "../styles/UniversitySelectionPage.css"
import logo from "../resources/FoodCraft-Icon-transparent.png";
import DropdownBox from "../components/DropdownBox";
import {useNavigate} from "react-router-dom";
import leftArrow from "../resources/left-arrow2.png";

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
                <button className="back-button" onClick={navigateToHome}><img className="arrow" src={leftArrow} alt="arrow"/>zurück</button>
                <div className="university-selection-top-margin"></div>
                <img src={logo} className="food-craft-icon" alt="( )"/>
                <h1 className="heading">MealCraft</h1>
                <h2 className="sub-heading">Uni auswählen</h2>
            </header>
            <div className="dropdown-box">
                <DropdownBox
                    name="cars"
                    options={universities}
                    defaultValue="student"
                    label="Universität"
                    onChange={handleUniversityChange}
                />
            </div>

            <button className="continue-button" onClick={navigateToCampusSelection}>Weiter</button>

        </div>
    );
}
