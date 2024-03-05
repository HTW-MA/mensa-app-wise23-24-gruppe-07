import React, {ReactElement, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "../styles/HomePage.css";
import "../styles/MealButtonStyles.css";
import rightArrow from "../resources/right-arrow.png";
import leftArrow from "../resources/left-arrow.png";
import deactivatedLeftArrow from "../resources/left-arrow-deactivated.png";
import deactivatedRightArrow from "../resources/right-arrow-deactivated.png";
import axios from "axios";
import "../pages/CanteenSelectionPage.tsx"
import {Canteen, Menu} from "./Interfaces";

export default function HomePage(): ReactElement {
    const [weekOffset, setWeekOffset] = useState<number>(0);

    const location = useLocation();
    const { canteen } = location.state as {canteen: Canteen };

    const navigate = useNavigate();
    const navigateToSettingsPage = () => {
        navigate('/settings', {state: {canteen: canteen}});
    };

    const [date, setDate] = useState(convertDateToString(getCurrentlyValidDate()));

    const [menu, setMenu] = React.useState<Menu[]>([]);
    const [total, setTotal] = useState(0.00);
    let currentWeek:string[] = getWeekdaysFor(new Date(date));

    const [useEffectHookTrigger, setUseEffectHookTrigger] = useState(0);

    useEffect( () => {
        axios
            .get(
                "https://mensa.gregorflachs.de/api/v1/menue?canteenId=" + canteen.id + "&startdate=" + date + "&enddate=" + date,
                {headers: { "X-API-KEY": process.env.REACT_APP_API_KEY }}
            )
            .then(response => {
                setMenu(response.data);
                console.log(response.data);
            });
    }, [useEffectHookTrigger, date, canteen.id]);

    const loadPreviousWeek = () => {
        if (weekOffset == 0) return
        currentWeek = offsetWeekBy(-1)
    }

    const loadNextWeek = () => {
        if (weekOffset == 1) return
        currentWeek = offsetWeekBy(1)
    }

    function offsetWeekBy(offset: number): string[] { // offset: -1 = previous week, 1 = next week etc.
        let offsetDate = new Date(date); // copy to not change provided date

        offsetDate.setDate(offsetDate.getDate() + offset * 7);
        setDate(convertDateToString(offsetDate));

        setUseEffectHookTrigger(prev => prev + 1);
        setWeekOffset(weekOffset + offset)
        return getWeekdaysFor(offsetDate);
    }

    function getCurrentlyValidDate(): Date {
        let currentDate = new Date();
        let hourOfCanteenClosure = 18

        if (currentDate.getHours() >= hourOfCanteenClosure) currentDate.setDate(currentDate.getDate() + 1);

        // Skip Saturdays and Sundays
        while (currentDate.getDay() === 0 || currentDate.getDay() === 6) currentDate.setDate(currentDate.getDate() + 1);

        return currentDate;
    }

    function convertDateToString(date: Date): string {
        // Format the date as YYYY-MM-DD
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 because months are zero-based
        const day = date.getDate();

        // Ensure month and day are two digits (von 2024-2-9 zu 2024-02-09)
        const formattedMonth = month.toString().padStart(2, '0'); // padStart fügt 0 vorne an, wenn die Länge des Strings kleiner als 2 ist
        const formattedDay = day.toString().padStart(2, '0');

        return `${year}-${formattedMonth}-${formattedDay}`;
    }

    function getReformattedDate(date: string) {
        const parts = date.split("-");
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }

    function getWeekdaysFor(date: Date) {
        const dayOfWeek = date.getDay();
        const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Assuming getDate never returns a weekend date, but keeping logic for safety.
        const monday = new Date(date.setDate(date.getDate() - offset));

        const weekdays = [];
        for (let i = 0; i < 5; i++) { // Iterate from Monday to Friday
            const nextDay = new Date(monday);
            nextDay.setDate(monday.getDate() + i);
            weekdays.push(nextDay.toISOString().substring(0, 10)); // toISOString returns a string in the format "YYYY-MM-DDTHH:MM:SS.sssZ"
        }
        return weekdays;
    }

    interface BadgeIconMapping {
        [key: string]: string;
    }

    const badgeIconMapping: BadgeIconMapping = {
        Vegan: 'vegan.png',
        Vegetarisch: 'vegetarisch.png',
        'Nachhaltige Fischerei': 'fish.png',
    };

    return (
        <div className="homepage">
            <header className="header">
                <div className="speiseplan-div">
                    <p className="speiseplan-tag">Meal Plan</p>
                </div>
                <div className="weekdays-buttons">
                    <button onClick={loadPreviousWeek} className="changeWeekButton">
                        <img className="arrow" src={weekOffset === 0 ? deactivatedLeftArrow : leftArrow} alt="arrow"/>
                    </button>
                    {currentWeek.map((day, index) => (
                        <button
                            key={index}
                            className={`weekday-button ${date === day ? 'selected' : (day == convertDateToString(new Date()) ? 'current-day' : '')}`}
                            onClick={() => {
                                setDate(day);
                                console.log("weekday button clicked: " + day);
                                setUseEffectHookTrigger(prev => prev + 1);
                            }}
                        >
                            {new Date(day).toLocaleDateString('de-DE', {
                                weekday: 'short'
                            })}
                        </button>
                    ))}
                    <button onClick={loadNextWeek} className="changeWeekButton">
                        <img className="arrow" src={weekOffset === 1 ? deactivatedRightArrow : rightArrow}  alt="arrow"/>
                    </button>
                </div>
            </header>
            <div className="homebody">
                <div className="nameDiv">
                    <p className="canteenName">{canteen.name}</p>
                    <p className="date">{getReformattedDate(date)}</p>
                </div>
                <div className="meal-list">
                    {menu.length > 0 ? (
                        menu.map((menuItem) => (
                            menuItem.meals
                                .filter((meal) => meal.category === "Essen")
                                .map((meal) => {
                                    const badgeName = meal.badges[1].name;
                                    const iconFileName = badgeIconMapping[badgeName];
                                    const iconSrc = iconFileName ? `${process.env.PUBLIC_URL}/${iconFileName}` : `${process.env.PUBLIC_URL}/fleisch.png`;

                                    return (
                                            <button className="mealButton" key={meal.id}>
                                                <img className="veganIcon" src={iconSrc} alt={badgeName}/>
                                                <span className="mealName">{meal.name}</span>
                                                <span className="mealPrice">{meal.prices[0].price}€</span>
                                            </button>)
                                    }
                                )
                        ))
                    ) : (
                        <div className="no-menu-div">
                            <img src={`${process.env.PUBLIC_URL}/no-menu.png`} alt="noMenuIcon" className="no-menu-icon"/>
                            <p className="no-menu-message">No menu for this day</p>
                        </div>
                    )}
                </div>
            </div>
            <footer>
                <div className="footer-div">
                    <button className="footer-button selected">
                        <img className="buttonIcon" src={`${process.env.PUBLIC_URL}/heim.png`} alt="settingsIcon"/>
                        <p>Homepage</p>
                    </button>
                    <button className="footer-button" onClick={navigateToSettingsPage}>
                        <img className="buttonIcon" src={`${process.env.PUBLIC_URL}/settings.png`} alt="settingsIcon"/>
                        <p>Settings</p>
                    </button>
                    <button className="footer-button">
                        <img className="buttonIcon" src={`${process.env.PUBLIC_URL}/lesezeichen.png`}
                             alt="bookmarkIcon"/>
                        <p>Saved Meals</p>
                    </button>
                </div>
            </footer>
        </div>
    );
}