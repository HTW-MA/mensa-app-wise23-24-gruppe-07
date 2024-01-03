import React, {ReactElement, useEffect} from "react";
import "../styles/CampusSelectionPage.css";
import logo from "../resources/FoodCraft-Icon-transparent.png";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { useLocation } from 'react-router-dom';

export default function CampusSelectionPage(): ReactElement {
    interface Address {
        street: string;
        city: string;
        zipcode: string;
        district: string;
        geoLocation: {
            longitude: number;
            latitude: number;
        };
    }

    interface Canteen {
        name: string;
        address: Address;
        id: string;
    }

    const [canteens, setCanteens] = React.useState<Canteen[]>([]);
    const location = useLocation();
    const { university } = location.state || {};

    const roles = [
        { label: "HTW Berlin", value: 'htw-berlin'}
    ]

    const navigate = useNavigate();

    const navigateToUniversitySelection = () => {
        navigate('/university-selection');
    };

    const navigateToHomepage = () => {
        navigate('/homepage');
    };

    useEffect( () => {
        axios
            .get("https://mensa.gregorflachs.de/api/v1/canteen?name=" +university, {
                headers: {
                    "X-API-KEY": "pzVf9YIu2KOTssG0dsLtU9/G6F6CWhocOK+TjmMkB7RVtCpEDVJ46aZzoe544nHRQlcaF8tSSnOTkuIPhIa22TwSdGzST7JCPMUwMsn0B6C3VwG9W98Y6at5EwfePtfflKmIEFgGc1c1lGI2JZzjPy4LsR4GmkdrJaCTrdYcVksJWMinf6fuzdnpx0i+Yx8ah9eZOKw8/DONX2GXLguKSP+N9/MA7CrdChsNIIbGyJqR/hZXMBOCcbU1c0CxPM64Hd7QTImeAxjkFw6UpGE1xvxBvSYOA5e23ep1f+5DNyazNVt+ofztgYQcn/jcLXCUae674NA8m54U2vQBBBxI6w=="
                }
            })
            .then(response => {
                setCanteens(response.data);
            });
    }, [])
    return (
        <div className="page">
            <header>
                <img src={logo} className="food-craft-icon" alt="( )"/>
                <h1 className="heading">MealCraft</h1>
                <h2 className="sub-heading">Select Canteen</h2>
            </header>
            <h3>Selected University: {university}</h3>
            <div className="canteen-list">
                {canteens.map((canteen) => (
                    <button
                        key={canteen.id}
                        className="canteen-button"
                    >
                        <h3>{canteen.name}</h3>
                        <p>{`${canteen.address.street}, ${canteen.address.city}, ${canteen.address.zipcode}, ${canteen.address.district}`}</p>
                    </button>
                ))}
            </div>

            <div className="navigation-buttons">
                <button className="back-button" onClick={navigateToUniversitySelection}>&lt; select university</button>
                <button className="continue-button" onClick={navigateToHomepage}>Continue &gt;</button>
            </div>

        </div>
    );
}