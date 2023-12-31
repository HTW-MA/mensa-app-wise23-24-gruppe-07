import {ReactElement} from "react";
import "./GeneralStylesheet.css";
import "./UniversitySelectionPage.css"
import logo from "../ressources/FoodCraft-Icon-transparent.png";
import googleMapsSearchIcon from "../ressources/GoogleMaps-search-Icon.png";
import DropdownBox from "../components/DropdownBox";
import {useNavigate} from "react-router-dom";

function WelcomePage(): ReactElement {
    const roles = [
        { label: "HTW Berlin", value: 'htw-berlin'}
    ]

    const navigate = useNavigate();

    const navigateToUniversitySelection = () => {
        navigate('/university-selection');
    };

    return (
        <div className="page">
            <header>
                <img src={logo} className="food-craft-icon" alt="( )"/>
                <h1 className="heading">MealCraft</h1>
                <h2 className="sub-heading">Select Campus</h2>
            </header>
            <button className="continue-button">Continue</button>

        </div>
    );
}

export default WelcomePage;