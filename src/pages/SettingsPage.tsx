import React, {ReactElement, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "../styles/SettingsPage.css";
import {Canteen, Menu} from "./Interfaces";
import DropdownBox from "../components/DropdownBox";
import axios from "axios";

export default function SettingsPage(): ReactElement {

    const location = useLocation();
    const initialUniversity = location.state?.university as string;
    const initialCanteen = location.state?.canteen as Canteen;
    const [selectedUniversity, setSelectedUniversity] = useState(initialUniversity);
    const [selectedCanteenName, setSelectedCanteenName] = useState(initialCanteen.name);
    const [canteenOptions, setCanteenOptions] = useState([{ label: "", value: "" }]);
    const [canteens, setCanteens] = useState<Canteen[]>([]);

    const navigate = useNavigate();
    const navigateToHomePage = () => {
        let savedCanteen:any = canteens.find(canteen => canteen.name === selectedCanteenName);
        console.log(canteens);
        if(savedCanteen === undefined) {
            savedCanteen = initialCanteen;
        }
        console.log(savedCanteen);
        navigate('/homepage', {state: {university: selectedUniversity, canteen: savedCanteen}});
    };
    const navigateToSavedMealsPage = () => {
        navigate('/saved-meals', {state: {university: selectedUniversity, canteen: initialCanteen}});
    }

    const handleUniversityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUniversity(event.target.value);
    };
    const handleCanteenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCanteenName(event.target.value);
    }

    const universities = [
        { label: "HTW", value: 'HTW'},
        { label: "TU", value: 'TU'},
        { label: "FU", value: 'FU'},
        { label: "HU", value: 'HU'},
        { label: "BHT", value: 'BHT'},
        { label: "HWR", value: 'HWR'},
        { label: "ASH", value: 'ASH'},
        { label: "Charité", value: 'Charité'},
        { label: "HfM", value: 'HfM'},
        { label: "EHB", value: 'EHB'}
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
                setCanteens(response.data);
                console.log(canteens);
                setCanteenOptions(fetchedCanteens);
                const canteenExists = fetchedCanteens.some((canteen: { value: string; }) => canteen.value === selectedCanteenName);
                if (!canteenExists && fetchedCanteens.length > 0) {
                    // If it doesn't exist, update the selected canteen name to the first in the new list
                    setSelectedCanteenName(fetchedCanteens[0].value);
                }
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
                        value={selectedUniversity}
                        label="Universität"
                        onChange={handleUniversityChange}
                    />
                </div>

                <div className="dropBox2">
                    <DropdownBox
                        name="mensa"
                        options={canteenOptions}
                        value={selectedCanteenName}
                        label="Mensa"
                        onChange={handleCanteenChange}
                    />
                </div>
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