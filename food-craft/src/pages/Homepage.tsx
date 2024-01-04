import React, {ReactElement, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "../styles/Homepage.css";
import logo from "../resources/FoodCraft-Icon-transparent.png";
import axios from "axios";

export default function Homepage(): ReactElement {

    const navigate = useNavigate();

    const location = useLocation();
    const { canteenId, canteenName } = location.state || {};

    console.log("Selected CanteenID: " + canteenId)
    console.log("Selected Canteen Name: " + canteenName)


    interface Price {
        priceType: string;
        price: number;
    }

    interface Meal {
        id: string;
        category: string;
        name: string;
        waterBilanz: number;
        co2Bilanz: number;
        price: Price;
    }

    interface Menue {
        date: string;
        canteenId: string;
        meals: Meal[];
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
                    <div className="date-selector">
                        <button>&lt;</button>
                        <p className="datum">04.12.2023 - 08.12.2023</p>
                        <button>&gt;</button>
                    </div>
                </div>
                <img src={logo} className="logo" alt="logo"/>
            </header>


            <div className="nameDiv">
                <p className="canteenName">{canteenName}</p>
                <p className="date">{date}</p>
            </div>
            <div className="homebody">
            <div className="meal-list">
                    {menue.map((menueItem) => (
                        menueItem.meals.map((meal) =>
                            <button className="mealButton">{meal.name}</button>
                        )
                    ))}
                </div>
                <div className="footer">
                    <p className="gesamtpreis">0,00€</p>
                </div>
            </div>

        </div>
    );
}