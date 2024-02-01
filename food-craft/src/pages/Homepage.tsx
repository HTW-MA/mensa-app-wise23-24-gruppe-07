import React, {ReactElement, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "../styles/Homepage.css";
import "../styles/MealButtonStyles.css";
import logo from "../resources/FoodCraft-Icon-transparent.png";
import axios from "axios";

export default function Homepage(): ReactElement {
    const location = useLocation();
    const { canteenId, canteenName } = location.state || {};

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

    const [menue, setMenue] = React.useState<Menue[]>([]);

    function getDate(): string {
        let currentDate = new Date();
        const sixPM = 18; // 2 PM in 24-hour format

        // Check if current time is past 2 PM
        if (currentDate.getHours() >= sixPM) {
            // Increment the date by one day
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Check if the date falls on a weekend
        while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            // Increment the date by one day until it's Monday
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Format the date as YYYY-MM-DD
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Add 1 because months are zero-based
        const day = currentDate.getDate();

        // Ensure month and day are two digits
        const formattedMonth = month.toString().padStart(2, '0');
        const formattedDay = day.toString().padStart(2, '0');

        return `${year}-${formattedMonth}-${formattedDay}`;
    }

    const date = getDate();
    const parts = date.split("-");
    const reformattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
    const [total, setTotal] = useState(0.00);

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
                <div className="header-tags">
                    <p className="speiseplan-tag">Speiseplan</p>
                </div>
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
                                const iconSrc = badgeName === "Vegan"
                                    ? `${process.env.PUBLIC_URL}/vegan.png`
                                    : badgeName === "Vegetarisch"
                                        ? `${process.env.PUBLIC_URL}/vegetarisch.png`
                                        : badgeName === "Nachhaltige Fischerei"
                                    ? `${process.env.PUBLIC_URL}/fish.png`
                                : "";

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
            <div className="footer">
                <p className="gesamtpreis">{total}€</p>
            </div>
        </div>
    );
}