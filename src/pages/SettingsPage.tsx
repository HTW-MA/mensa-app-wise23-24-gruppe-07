import React, {ReactElement, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "../styles/SettingsPage.css";
import {Canteen, Menu} from "./Interfaces";
import DropdownBox from "../components/DropdownBox";
import axios from "axios";
import {getRoleFromPreferences, getUniversityFromPreferences} from "../userPreferencesStore";

export default function SettingsPage(): ReactElement {

    const location = useLocation();
    const initialCanteen = location.state?.canteen as Canteen;

    const [selectedUniversity, setSelectedUniversity] = useState<string>();
    const [selectedCanteenName, setSelectedCanteenName] = useState(initialCanteen.name);
    const [selectedRole, setSelectedRole] = useState<string>();
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
        navigate('/homepage', {state: {university: selectedUniversity, canteen: savedCanteen, role: selectedRole}});
    };
    const navigateToSavedMealsPage = () => {
        navigate('/saved-meals', {state: {university: selectedUniversity, canteen: initialCanteen, role: selectedRole}});
    }

    const handleUniversityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUniversity(event.target.value);
    };
    const handleCanteenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCanteenName(event.target.value);
    }

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(event.target.value);
        console.log(event.target.value);
    }

    const universitiesSelection = [
        { label: "HTW", value: 'Hochschule für Technik und Wirtschaft Berlin'},
        { label: "TU", value: 'Technische Universität Berlin'},
        { label: "FU", value: 'Freie Universität Berlin'},
        { label: "HU", value: 'Humboldt-Universität zu Berlin'},
        { label: "BHT", value: 'Berliner Hochschule für Technik '},
        { label: "HWR", value: 'Hochschule für Wirtschaft und Recht Berlin'},
        { label: "ASH", value: 'Alice Salomon Hochschule Berlin'},
        { label: "Charité", value: 'Charité - Universitätsmedizin Berlin'},
        { label: "HfM", value: 'Hochschule für Musik Hanns Eisler Berlin'},
        { label: "EHB", value: 'Evangelische Hochschule Berlin'}
    ]

    const findLabelByValue = (value: string): string | undefined => {
        const match = universitiesSelection.find(option => option.value === value);
        return match ? match.label : undefined;
    };

    const roles = [
        { label: "Student", value: 'Student' },
        { label: "Angestellt", value: 'Angestellt' },
        { label: "Gast", value: 'Gast' }
    ];
    /*
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
     */

    useEffect(() => {
        const setPreferences = async () => {
            try {
                const role = await getRoleFromPreferences();
                setSelectedRole(role);
                const universityValue = await getUniversityFromPreferences(); // This needs to return the full name (value)
                setSelectedUniversity(universityValue);
            } catch (error) {
                console.error('Error setting preferences:', error);
            }
        };

        setPreferences();
    }, []);

    return (
        <div className="homepage">
            <header className="header">
                <div className="speiseplan-div">
                    <p className="speiseplan-tag">Einstellungen</p>
                </div>
            </header>
            <div className="homebody-settings">
                <div className="userSettingsDiv">
                    <div className="dropBox3">
                        <DropdownBox
                            name="rollen"
                            options={roles}
                            value={selectedRole}
                            label="Rolle"
                            onChange={handleRoleChange}
                        />
                    </div>
                    <div className="dropBox">
                        <DropdownBox
                            name="uni"
                            options={universitiesSelection}
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
                <div className="guthaben-Div">
                    <p className="guthaben-tag">Guthaben der Mensakarte überprüfen</p>
                    <p className="guthaben">0.00€</p>
                    <button className="guthaben-button">Mensakarte scannen</button>
                </div>
            </div>
            <footer>
                <div className="footer-div">
                    <button className="footer-button" onClick={navigateToHomePage}>
                        <img className="buttonIcon" src={`${process.env.PUBLIC_URL}/heim.png`} alt="settingsIcon"/>
                        <p>Speiseplan</p>
                    </button>
                    <button className="footer-button selected">
                        <img className="buttonIcon" src={`${process.env.PUBLIC_URL}/settings-selected.png`} alt="settingsIcon"/>
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