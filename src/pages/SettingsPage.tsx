import React, {ReactElement, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "../styles/HomePage.css";
import "../styles/MealButtonStyles.css";
import "../pages/CanteenSelectionPage.tsx"
import {Canteen, Menu} from "./Interfaces";

export default function SettingsPage(): ReactElement {

    const location = useLocation();
    const { canteen } = location.state as {canteen: Canteen };
    const navigate = useNavigate();
    const navigateToHomePage = () => {
        navigate('/homepage', {state: {canteen: canteen}});
    };
    const navigateToSavedMealsPage = () => {
        navigate('/saved-meals', {state: {canteen: canteen}});
    }

    return (
        <div className="homepage">
            <header className="header">
                <div className="speiseplan-div">
                    <p className="speiseplan-tag">Settings</p>
                </div>
            </header>
            <div className="homebody">
            </div>
            <footer>
                <div className="footer-div">
                    <button className="footer-button" onClick={navigateToHomePage}>
                        <img className="buttonIcon" src={`${process.env.PUBLIC_URL}/heim.png`} alt="settingsIcon"/>
                        <p>Homepage</p>
                    </button>
                    <button className="footer-button selected">
                        <img className="buttonIcon" src={`${process.env.PUBLIC_URL}/settings.png`} alt="settingsIcon"/>
                        <p>Settings</p>
                    </button>
                    <button className="footer-button" onClick={navigateToSavedMealsPage}>
                        <img className="buttonIcon" src={`${process.env.PUBLIC_URL}/lesezeichen.png`}
                             alt="bookmarkIcon"/>
                        <p>Saved Meals</p>
                    </button>
                </div>
            </footer>
        </div>
    );
}