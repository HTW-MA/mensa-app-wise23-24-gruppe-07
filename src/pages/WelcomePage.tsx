import React, { useState, useEffect, ReactElement } from "react";
import "../styles/GeneralStylesheet.css";
import "../styles/WelcomePage.css";
import logo from "../resources/FoodCraft-Icon-transparent.png";
import qrCode from "../resources/qr-code.png";
import DropdownBox from "../components/DropdownBox";
import { useNavigate } from "react-router-dom";
import {checkAndAddCanteens} from "../canteenStore";
import axios from "axios";

export default function WelcomePage(): ReactElement {
    const roles = [
        { label: "Student", value: 'Student' },
        { label: "Angestellt", value: 'Angestellt' },
        { label: "Gast", value: 'Gast' }
    ];

    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
    const [showModal, setShowModal] = useState(isDesktop);
    const [selectedRole, setSelectedRole] = useState('Student');

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(event.target.value);
    };

    useEffect(() => {
        const handleResize = () => {
            const isNowDesktop = window.innerWidth > 768;
            setIsDesktop(isNowDesktop);
            setShowModal(isNowDesktop);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        axios.get("https://mensa.gregorflachs.de/api/v1/canteen?loadingtype=lazy", {
            headers: {
                "X-API-KEY": process.env.REACT_APP_API_KEY
            }
        }).then((response) => {
            console.log('Canteens fetched from API');
            checkAndAddCanteens(response.data);
        }).catch(error => {
            console.error('Error fetching canteens:', error);
        });
    }, []); // Empty dependency array to ensure it runs only once on component mount

    //useEffect(() => {
    //    const preferencesSaved = localStorage.getItem('preferencesSaved');

    //    if (preferencesSaved) {
    //        window.location.href = '/homepage';
    //    }
    //}, []);


    const navigate = useNavigate();

    const navigateToUniversitySelection = () => { navigate('/university-selection', {state: {role: selectedRole}}); };

    const DesktopModal = () => (
        <div className="desktop-modal">
            <div className="ModalContent">
                <img className="qrCodeImg" src={qrCode} alt="qrCode"/>
                <div className="modalText">
                    <p>Für die beste Benutzererfahrung <br/> besuche MealCraft gerne auf deinem Handy und <br/> füge die Website zum Homebildschirm hinzu. <br/> Scanne
                        hierfür den
                        QR-Code. :)</p>
                    <button className="continue-desktop-button" onClick={() => setShowModal(false)}>Im Desktop Browser
                        fortfahren
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="page">
            {showModal && <DesktopModal/>}
            <header>
                <img src={logo} className="food-craft-icon" alt="( )"/>
                <h1 className="heading">MealCraft</h1>
                <h2 className="sub-heading">Willkommen</h2>
            </header>
            <span className="welcome-paragraph">
                <u><b>Neu hier?</b></u><br/>
                Gib uns einige Informationen über dich<br/>
                damit wir die App für dich personalisieren können.
            </span>
            <div className="dropdown-box">
                <DropdownBox
                    name="roles"
                    options={roles}
                    value={selectedRole}
                    label="Rolle"
                    onChange={handleRoleChange}
                />
            </div>
            <div className="button-container">
                <button className="continue-button" onClick={navigateToUniversitySelection}>Weiter</button>
            </div>
        </div>
    );
}
