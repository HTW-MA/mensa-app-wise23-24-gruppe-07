import React, {ReactElement, useEffect, useState} from "react";
import "../styles/GeneralStylesheet.css";
import "../styles/UniversitySelectionPage.css"
import logo from "../resources/FoodCraft-Icon-transparent.png";
import DropdownBox from "../components/DropdownBox";
import {useLocation, useNavigate} from "react-router-dom";
import leftArrow from "../resources/left-arrow2.png";
import {Canteen} from "./Interfaces";
import {calculateDistance} from "../geolocation";
import {getAllCanteens, getCanteensByUniversity} from "../canteenStore";

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


    const [canteens, setCanteens] = React.useState<Canteen[]>([]);

    const selectUniversityWithNearestCanteen = function() {
        let latitude = 0;
        let longitude = 0;
        let nearestCanteen: Canteen | null = null;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude
                },
                (error) => {
                    console.error(error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }

        let nearestDist = Infinity;
        canteens.forEach(canteen => {
            if (nearestCanteen == null) {
                nearestCanteen = canteen
            }
            const distance = calculateDistance(latitude, longitude, canteen.address.geoLocation.latitude, canteen.address.geoLocation.longitude);
            if (distance < nearestDist) {
                nearestDist = distance;
                nearestCanteen = canteen;
            }
        });
        setSelectedUniversity(nearestCanteen!.universities[0])
        navigate('/campus-selection', {state: {university: nearestCanteen!.universities[0], role: role}});
    }

    useEffect(() => {
        getAllCanteens().then(canteens => setCanteens(canteens))
    }, []);

    return (
        <div className="page">
            <header>
                <button className="back-button" onClick={navigateToHome}><img className="arrow" src={leftArrow}
                                                                              alt="arrow"/>Zurück
                </button>
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
            <button className="selectNearestButton" onClick={selectUniversityWithNearestCanteen}>Nächstgelegene Mensa von dir wählen</button>
            <button className="continue-button" onClick={navigateToCampusSelection}>Weiter</button>

        </div>
    );
}
