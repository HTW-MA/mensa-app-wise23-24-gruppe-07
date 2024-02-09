import React, {ReactElement, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "../styles/Homepage.css";
import "../styles/MealButtonStyles.css";
import logo from "../resources/FoodCraft-Icon-transparent.png";
import axios from "axios";

export default function Homepage(): ReactElement {
    interface Price {
        priceType: string;
        price: number;
    }

    interface Meal {
        id: string;
        name: string;
        prices: Price[];
        category: string;
        additives: Additive[];
        badges: Badge[];
        waterBilanz: number;
        co2Bilanz: number;
    }

    interface Menue {
        date: string;
        canteenId: string;
        meals: Meal[];
    }

    interface Additive {
        ID: string;
        text: string;
        referenceid: string;
    }

    interface Badge {
        ID: string;
        name: string;
        description: string;
    }

    const location = useLocation();
    const { canteenId, canteenName } = location.state || {};
    const date = getDate();
    const parts = date.split("-");
    const reformattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
    const [total, setTotal] = useState(0.00);
    const navigate = useNavigate();
    const [menue, setMenue] = React.useState<Menue[]>([]);
    const currentWeek = getWeekdaysforCurrentWeek();
    const firstDayOfTheWeek = currentWeek[0];
    const lastDayOfTheWeek = currentWeek.slice(-1);

    function getDate(): string {
        let currentDate = new Date();
        // ist es nach 18 Uhr? Wenn Ja, dann Datum um 1 erhöhen
        if (currentDate.getHours() >= 18) currentDate.setDate(currentDate.getDate() + 1);

        // ist es Samstag oder Sonntag? Dann Datum immer um 1 erhöhen bis Montag
        while (currentDate.getDay() === 0 || currentDate.getDay() === 6) currentDate.setDate(currentDate.getDate() + 1);

        // Format the date as YYYY-MM-DD
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Add 1 because months are zero-based
        const day = currentDate.getDate();

        // Ensure month and day are two digits (von 2024-2-9 zu 2024-02-09)
        const formattedMonth = month.toString().padStart(2, '0'); // padStart fügt 0 vorne an, wenn die Länge des Strings kleiner als 2 ist
        const formattedDay = day.toString().padStart(2, '0');

        return `${year}-${formattedMonth}-${formattedDay}`;
    }

    function getWeekdaysforCurrentWeek() {
        const adjustedDate = new Date(getDate());
        const dayOfWeek = adjustedDate.getDay();
        const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Assuming getDate never returns a weekend date, but keeping logic for safety.
        const monday = new Date(adjustedDate.setDate(adjustedDate.getDate() - offset));

        const weekdays = [];
        for (let i = 0; i < 5; i++) { // Iterate from Monday to Friday
            const nextDay = new Date(monday);
            nextDay.setDate(monday.getDate() + i);
            weekdays.push(nextDay.toISOString().substring(0, 10)); // toISOString returns a string in the format "YYYY-MM-DDTHH:MM:SS.sssZ"
        }

        return weekdays;
    }

    console.log(currentWeek);
    console.log("first day of the week: " + firstDayOfTheWeek);
    console.log("last day of the week: " + lastDayOfTheWeek);

    useEffect( () => {
        axios
            .get("https://mensa.gregorflachs.de/api/v1/menue?canteenId=" + canteenId + "&startdate=" + date+ "&enddate="+date, {
                headers: {
                    "X-API-KEY": "pzVf9YIu2KOTssG0dsLtU9/G6F6CWhocOK+TjmMkB7RVtCpEDVJ46aZzoe544nHRQlcaF8tSSnOTkuIPhIa22TwSdGzST7JCPMUwMsn0B6C3VwG9W98Y6at5EwfePtfflKmIEFgGc1c1lGI2JZzjPy4LsR4GmkdrJaCTrdYcVksJWMinf6fuzdnpx0i+Yx8ah9eZOKw8/DONX2GXLguKSP+N9/MA7CrdChsNIIbGyJqR/hZXMBOCcbU1c0CxPM64Hd7QTImeAxjkFw6UpGE1xvxBvSYOA5e23ep1f+5DNyazNVt+ofztgYQcn/jcLXCUae674NA8m54U2vQBBBxI6w=="
                }
            })
            .then(response => {
                setMenue(response.data);
                console.log(response.data);
            });
    }, [])

    return (
        <div className="homepage">
            <header className="header">
                <p className="speiseplan-tag">Speiseplan</p>
                <img src={logo} className="logo" alt="logo"/>
            </header>
            <div className="homebody">
                <div className="nameDiv">
                    <p className="canteenName">{canteenName}</p>
                    <p className="date">{reformattedDate}</p>
                </div>
                <div className="meal-list">
                    {menue.map((menueItem) => (
                        menueItem.meals
                            .filter((meal) => meal.category === "Essen")
                            .map((meal) =>{
                                const badgeName = meal.badges[1].name;
                                console.log(badgeName);
                                const iconSrc = badgeName === "Vegan"
                                    ? `${process.env.PUBLIC_URL}/vegan.png`
                                    : badgeName === "Vegetarisch"
                                        ? `${process.env.PUBLIC_URL}/vegetarisch.png`
                                        : badgeName === "Nachhaltige Fischerei"
                                    ? `${process.env.PUBLIC_URL}/fish.png`
                                : badgeName === "CO2_bewertung_C"
                                                ? `${process.env.PUBLIC_URL}/fleisch.png`
                                :"";

                                return (<button className="mealButton" key={meal.id}>
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
                        <img className="buttonIcon" src={`${process.env.PUBLIC_URL}/lesezeichen.png`} alt="bookmarkIcon"/>
                        <p>Saved Meals</p>
                    </button>
                </div>
            </footer>
        </div>
    );
}