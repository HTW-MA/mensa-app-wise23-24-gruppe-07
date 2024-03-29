import React, {ReactElement, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "../styles/SettingsPage.css";
import {Canteen, Menu} from "./Interfaces";
import DropdownBox from "../components/DropdownBox";
import axios from "axios";

export default function SettingsPage(): ReactElement {

    const location = useLocation();
    const { university } = location.state as { university: string };
    const { canteen } = location.state as { canteen: Canteen };

    const initialUniversity = location.state?.university as string;
    const initialCanteen = location.state?.canteen as Canteen;
    console.log("initial uni: " + initialUniversity);
    console.log("initial canteen: " + initialCanteen.name);
    const [selectedUniversity, setSelectedUniversity] = useState(initialUniversity);
    const [selectedCanteen, setSelectedCanteen] = useState(initialCanteen.name);
    const [canteens, setCanteens] = useState([{ label: "", value: "" }]);

    const navigate = useNavigate();
    const navigateToHomePage = () => {
        navigate('/homepage', {state: {university: university, canteen: canteen}});
    };
    const navigateToSavedMealsPage = () => {
        navigate('/saved-meals', {state: {university: university, canteen: canteen}});
    }

    const handleUniversityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUniversity(event.target.value); // Update the selectedUniversity state
    };
    const handleCanteenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCanteen(event.target.value);
        console.log("canteen: " + selectedCanteen);
    }

    const universities = [
        { label: "HTW", value: 'HTW'},
        { label: "FU", value: 'FU'},
        { label: "HU", value: 'HU'},
        { label: "BHT", value: 'BHT'},
        { label: "HWR", value: 'HWR'}
    ]
    useEffect( () => {
        const fetchCanteens = async () => {
            try {
                const response = await axios.get("https://mensa.gregorflachs.de/api/v1/canteen?name=" + selectedUniversity, {
                    headers: {
                        "X-API-KEY": process.env.REACT_APP_API_KEY}
                });
                const fetchedCanteens = response.data.map((canteen: { name: any; }) => ({
                    label: canteen.name,
                    value: canteen.name
                }));
                setCanteens(fetchedCanteens);
            } catch (error) {
                console.log(error);
            }
        }
        fetchCanteens().then(r => console.log("Canteens fetched"));
    }, [selectedUniversity])
    return (
        <div className="homepage">
            <header className="header">
                <div className="speiseplan-div">
                    <p className="speiseplan-tag">Einstellungen</p>
                </div>
            </header>
            <div className="homebody-settings">
                <div className="dropBox">
                    <DropdownBox
                        name="uni"
                        options={universities}
                        value={university}
                        label="Universität"
                        onChange={handleUniversityChange}
                    />
                </div>

                <div className="dropBox2">
                    <DropdownBox
                        name="mensa"
                        options={canteens}
                        value={selectedCanteen}
                        label="Mensa"
                        onChange={handleCanteenChange}
                    />
                </div>
                <button className="saveSettingsButton">Einstellungen speichern</button>
            </div>
            <footer>
                <div className="footer-div">
                <button className="footer-button" onClick={navigateToHomePage}>
                        <img className="buttonIcon" src={`${process.env.PUBLIC_URL}/heim.png`} alt="settingsIcon"/>
                        <p>Speiseplan</p>
                    </button>
                    <button className="footer-button selected">
                        <img className="buttonIcon" src={`${process.env.PUBLIC_URL}/settings.png`} alt="settingsIcon"/>
                        <p>Einstellungen</p>
                    </button>
                    <button className="footer-button" onClick={navigateToSavedMealsPage}>
                        <img className="buttonIcon" src={`${process.env.PUBLIC_URL}/lesezeichen.png`}
                             alt="bookmarkIcon"/>
                        <p>Gespeichert</p>
                    </button>
                </div>
            </footer>
        </div>
    );
}