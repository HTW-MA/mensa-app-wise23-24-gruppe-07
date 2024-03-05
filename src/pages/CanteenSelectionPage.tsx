import React, {ReactElement, useEffect, useState} from "react";
import "../styles/CanteenSelectionPage.css";
import logo from "../resources/FoodCraft-Icon-transparent.png";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import {Canteen} from "./Interfaces";

export default function CanteenSelectionPage(): ReactElement {
    const location = useLocation();
    const { university } = location.state as { university: string};

    const [canteens, setCanteens] = React.useState<Canteen[]>([]);
    const [selectedCanteen, setSelectedCanteen] = useState<Canteen>();

    const navigate = useNavigate();
    const navigateToUniversitySelection = () => {
        navigate('/university-selection');
    };
    const navigateToHomepage = () => {
        if (selectedCanteen == null) return;
        navigate('/homepage', {state: {canteen: selectedCanteen}});
    };

    useEffect( () => {
        axios
            .get("https://mensa.gregorflachs.de/api/v1/canteen?name=" + university, {
                headers: {
                    "X-API-KEY": process.env.REACT_APP_API_KEY}
            })
            .then(response => {
                setCanteens(response.data);
            });
    }, [])

    return (
        <div className="page">
            <header>
                <button className="back-button" onClick={navigateToUniversitySelection}>&#60;   Back</button>
                <div className="canteen-selection-top-margin"></div>
                <img src={logo} className="food-craft-icon" alt="( )"/>
                <h1 className="heading">MealCraft</h1>
                <h2 className="sub-heading">Select Canteen</h2>
            </header>
            <h3>Selected University: {university}</h3>
            <div className="canteen-list">
                {canteens.map((canteen) => (
                    <button
                        key={canteen.id}
                        className={`canteen-button ${selectedCanteen != null && selectedCanteen.id === canteen.id ? 'canteen-button-active' : ''}`}
                        onClick={() => setSelectedCanteen(canteen)}
                    >
                        <h3 className="canteenName-Button">{canteen.name}</h3>
                        <p className="canteenStreet">{`${canteen.address.street}, ${canteen.address.city}, ${canteen.address.zipcode}, ${canteen.address.district}`}</p>
                    </button>
                ))}
            </div>
            <button className="continue-button" onClick={navigateToHomepage}>Continue</button>
        </div>
    );
}
