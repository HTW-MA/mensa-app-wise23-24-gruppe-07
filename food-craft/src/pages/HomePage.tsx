import React, {ReactElement, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "../styles/HomePage.css";
import "../styles/MealButtonStyles.css";
import logo from "../resources/FoodCraft-Icon-transparent.png";
import axios from "axios";
import "../pages/CanteenSelectionPage.tsx"
import {Canteen, Menu} from "./Interfaces";

export default function HomePage(): ReactElement {
    const location = useLocation();
    const { canteen } = location.state as {canteen: Canteen };

    const navigate = useNavigate();

    const [date, setDate] = useState(convertDateToString(getCurrentlyValidDate()));
    const [week, setWeek] = useState(getWeekdaysFor(new Date(date)));
    const [firstDayOfTheWeek, setFirstDayOfTheWeek] = useState(week[0]);
    const [lastDayOfTheWeek, setLastDayOfTheWeek] = useState(week[4]);

    const [menu, setMenu] = React.useState<Menu[]>([]);
    const [total, setTotal] = useState(0.00);

    const [useEffectHookTrigger, setUseEffectHookTrigger] = useState(0);

    useEffect( () => {
        axios
            .get(
                "https://mensa.gregorflachs.de/api/v1/menue?canteenId=" + canteen.id + "&startdate=" + date + "&enddate=" + date,
                {headers: { "X-API-KEY": process.env.REACT_APP_API_KEY }}
            )
            .then(response => {
                setMenu(response.data);
            });
    }, [useEffectHookTrigger])

    const loadPreviousWeek = () => {
        offsetWeekBy(-1);
        console.log("offset week");
    };

    const loadNextWeek = () => {
        offsetWeekBy(1);
        console.log("offset week");
    };

    function offsetWeekBy(offset: number) { // offset: -1 = previous week, 1 = next week etc.
        let offsetDate = new Date(date); // copy to not change provided date

        offsetDate.setDate(offsetDate.getDate() + offset * 7);

        setDate(convertDateToString(offsetDate));
        setWeek(getWeekdaysFor(offsetDate));
        setFirstDayOfTheWeek(week[0]);
        setLastDayOfTheWeek(week[4]);

        setUseEffectHookTrigger(prev => prev + 1);
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

    return (
        <div className="homepage">
            <header className="header">
                <p className="speiseplan-tag">Speiseplan</p>
                <img src={logo} className="logo" alt="logo"/>
            </header>
            <div className="header">
                <button onClick={loadPreviousWeek}>&lt;</button>
                <p className="week-date-left">{getReformattedDate(firstDayOfTheWeek)}</p>
                <p className="week-date-connector">-</p>
                <p className="week-date-right">{getReformattedDate(lastDayOfTheWeek)}</p>
                <button onClick={loadNextWeek}>&gt;</button>
            </div>
            <div className="homebody">
                <div className="nameDiv">
                    <p className="canteenName">{canteen.name}</p>
                    <p className="date">{getReformattedDate(date)}</p>
                </div>
                <div className="meal-list">
                    {menu.map((menuItem) => (
                        menuItem.meals
                            .filter((meal) => meal.category === "Essen")
                            .map((meal) => {
                                    const badgeName = meal.badges[1].name;
                                    console.log("badge-name: " + badgeName);
                                    const iconSrc = badgeName === "Vegan"
                                        ? `${process.env.PUBLIC_URL}/vegan.png`
                                        : badgeName === "Vegetarisch"
                                            ? `${process.env.PUBLIC_URL}/vegetarisch.png`
                                            : badgeName === "Nachhaltige Fischerei"
                                                ? `${process.env.PUBLIC_URL}/fish.png`
                                                : badgeName === "CO2_bewertung_C"
                                                    ? `${process.env.PUBLIC_URL}/fleisch.png`
                                                    : "";
                                    return (
                                        <button className="mealButton" key={meal.id}>
                                            <img className="veganIcon" src={iconSrc} alt="vegan"/>
                                            <span className="mealName">{meal.name}</span>
                                            <span className="mealPrice">{meal.prices[0].price}€</span>
                                        </button>)
                                }
                            )
                    ))}
                </div>
            </div>
            <div className="total-div">
                <p className="gesamtpreis">{total}€</p>
            </div>
            <footer>
                <div className="footer-div">
                    <button className="footer-button selected">
                        <img className="buttonIcon" src={`${process.env.PUBLIC_URL}/heim.png`} alt="settingsIcon"/>
                        <p>Homepage</p>
                    </button>
                    <button className="footer-button">
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