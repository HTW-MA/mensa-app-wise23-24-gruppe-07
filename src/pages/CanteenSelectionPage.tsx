import React, {ReactElement, useEffect, useState} from "react";
import "../styles/CanteenSelectionPage.css";
import logo from "../resources/FoodCraft-Icon-transparent.png";
import {useNavigate} from "react-router-dom";
import { useLocation } from 'react-router-dom';
import {Canteen} from "./Interfaces";
import leftArrow from "../resources/left-arrow2.png";
import { getCanteensByUniversity } from '../canteenStore';
import { addUserPreferences} from "../userPreferencesStore";
import {calculateDistance} from "../geolocation";

interface Location {
    latitude: number;
    longitude: number;
}

export default function CanteenSelectionPage(): ReactElement {
    const location = useLocation();
    const { university } = location.state as { university: string};
    const role = location.state?.role as string;

    const [canteens, setCanteens] = React.useState<Canteen[]>([]);
    const [selectedCanteen, setSelectedCanteen] = useState<Canteen | null>(null);

    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [nearestCanteen, setNearestCanteen] = useState<Canteen | null>(null);

    const navigate = useNavigate();
    const navigateToUniversitySelection = () => {
        navigate('/university-selection', {state: {role: role, university: university}});
    };
    const navigateToHomepage = () => {
        if (selectedCanteen == null) return;
        localStorage.setItem('preferencesSaved', 'true');
        addUserPreferences(role, university, selectedCanteen)
            .then(() => console.log("User preferences added or updated!"))
            .catch(error => console.error("Failed to add or update user preferences:", error));
        navigate('/homepage', {state: {canteen: selectedCanteen, university: university, role: role}});
    };

    useEffect(() => {
        getCanteensByUniversity(university).then(fetchedCanteens => {
            setCanteens(fetchedCanteens);
        }).catch(error => {
            console.error("Failed to fetch canteens from IndexedDB:", error);
        });
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error(error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    useEffect(() => {
        if (userLocation) {
            console.log(userLocation);
            let nearestDist = Infinity;
            let nearest: Canteen | null = null;
            canteens.forEach(canteen => {
                const distance = calculateDistance(userLocation.latitude, userLocation.longitude, canteen.address.geoLocation.latitude, canteen.address.geoLocation.longitude);
                if (distance < nearestDist) {
                    nearestDist = distance;
                    nearest = canteen;
                }
            });
            setNearestCanteen(nearest);
            setSelectedCanteen(nearest);
        }
    }, [userLocation]); // Location Mensa Treskowallee: 52.49268133238914, 13.523785615343602

    return (
        <div className="page">
            <header>
                <button className="back-button" onClick={navigateToUniversitySelection}><img className="arrow" src={leftArrow} alt="arrow"/>Zurück</button>
                <img src={logo} className="food-craft-icon" alt="( )"/>
                <h1 className="heading">MealCraft</h1>
                <h2 className="sub-heading">Mensa auswählen</h2>
            </header>
            <p className="selected-uni">Ausgewählte Uni: <br/> <span className="university">{university}</span></p>
                {nearestCanteen && (
                    <p className="selected-uni">Nächste Mensa von der Uni: <br/> <span className="university">{nearestCanteen.name}</span>
                    </p>
                )}
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
            <button className={selectedCanteen == null ? "continue-button-deactivated" : "continue-button" } onClick={navigateToHomepage}>Weiter</button>
        </div>
    );
}
