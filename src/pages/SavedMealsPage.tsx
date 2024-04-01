import React, {ReactElement, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "../styles/HomePage.css";
import "../styles/MealButtonStyles.css";
import "../pages/CanteenSelectionPage.tsx"
import {Canteen, Meal} from "./Interfaces";
import {readAllBookmarkedMealIdsFromStore, removeMealIdFromBookmarkedMealIds, getAllBookmarkedMeals} from "../BookmarkedMealsStore";

export default function SavedMealsPage(): ReactElement {

    const location = useLocation();
    const navigate = useNavigate();
    const { university } = location.state as { university: string };
    const { canteen } = location.state as { canteen: Canteen };
    const { role } = location.state as { role: string };
    const [savedMeals, setSavedMeals] = useState<any[]>([]);

    useEffect(() => {
        const fetchSavedMealIds = async () => {
            try {
                const meals = await getAllBookmarkedMeals();
                setSavedMeals(meals);
                console.log("Saved meals: ", meals);
            } catch (error) {
                console.error("Error fetching saved meal IDs:", error);
            }
        };

        fetchSavedMealIds();
    }, []);


    const navigateToHomePage = () => {
        navigate('/homepage', {state: {university: university, canteen: canteen, role: role}});
    };
    const navigateToSettingsPage = () => {
        navigate('/settings', {state: {university: university, canteen: canteen, role: role}});
    }

    return (
        <div className="homepage">
            <header className="header">
                <div className="speiseplan-div">
                    <p className="speiseplan-tag">Gespeichert</p>
                </div>
            </header>
            <div className="homebody">
                {
                    savedMeals.map((meal:any) => {
                        return (
                            <div key={meal.id} className="meal-button">
                                <p className="meal-name">{meal.name}</p>
                                <p className="meal-price">{meal.price}</p>
                            </div>
                        );
                    })
                }
            </div>
            <footer>
                <div className="footer-div">
                    <button className="footer-button" onClick={navigateToHomePage}>
                        <img className="buttonIcon" src={`${process.env.PUBLIC_URL}/heim.png`} alt="settingsIcon"/>
                        <p>Speiseplan</p>
                    </button>
                    <button className="footer-button" onClick={navigateToSettingsPage}>
                        <img className="buttonIcon" src={`${process.env.PUBLIC_URL}/settings.png`} alt="settingsIcon"/>
                        <p>Einstellungen</p>
                    </button>
                    <button className="footer-button selected">
                        <img className="buttonIcon" src={`${process.env.PUBLIC_URL}/lesezeichen-selected.png`}
                             alt="bookmarkIcon"/>
                        <p>Gespeichert</p>
                    </button>
                </div>
            </footer>
        </div>
    );
}