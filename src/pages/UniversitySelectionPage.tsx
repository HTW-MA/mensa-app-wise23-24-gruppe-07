import React, {ReactElement, useState} from "react";
import "../styles/GeneralStylesheet.css";
import "../styles/UniversitySelectionPage.css"
import logo from "../resources/FoodCraft-Icon-transparent.png";
import DropdownBox from "../components/DropdownBox";
import {useLocation, useNavigate} from "react-router-dom";
import leftArrow from "../resources/left-arrow2.png";

export default function WelcomePage(): ReactElement {
    const navigate = useNavigate();
    const location = useLocation();
    const university = location.state?.university as string ?? "Hochschule für Technik und Wirtschaft Berlin";
    const role = location.state?.role as string;
    console.log(role);
    const navigateToCampusSelection = () => {
        console.log(selectedUniversity)
        navigate('/campus-selection', {state: {university: selectedUniversity, role: role}});
    };
    const navigateToHome = () => {
        navigate('/');
    };

    const universities = [
        { label: "HTW", value: 'Hochschule für Technik und Wirtschaft Berlin'},
        { label: "TU", value: 'Technische Universität Berlin'},
        { label: "FU", value: 'Freie Universität Berlin'},
        { label: "HU", value: 'Humboldt-Universität zu Berlin'},
        { label: "BHT", value: 'Berliner Hochschule für Technik '},
        { label: "HWR", value: 'Hochschule für Wirtschaft und Recht Berlin'},
        { label: "ASH", value: 'Alice Salomon Hochschule Berlin'},
        { label: "Charité", value: 'Charité - Universitätsmedizin Berlin'},
        { label: "HfM", value: 'Hochschule für Musik Hanns Eisler Berlin'},
        { label: "EHB", value: 'Evangelische Hochschule Berlin'}
    ]

    const [selectedUniversity, setSelectedUniversity] = useState(university);

    const handleUniversityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUniversity(event.target.value);
    };

    return (
        <div className="page">
            <header>
                <button className="back-button" onClick={navigateToHome}><img className="arrow" src={leftArrow} alt="arrow"/>Zurück</button>
                <img src={logo} className="food-craft-icon" alt="( )"/>
                <h1 className="heading">MealCraft</h1>
                <h2 className="sub-heading">Uni auswählen</h2>
            </header>
            <div className="dropdown-box">
                <DropdownBox
                    name="cars"
                    options={universities}
                    value={selectedUniversity}
                    label="Universität"
                    onChange={handleUniversityChange}
                />
            </div>

            <button className="continue-button" onClick={navigateToCampusSelection}>Weiter</button>

        </div>
    );
}
