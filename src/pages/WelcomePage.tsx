import React, { useState, useEffect, ReactElement } from "react";
import "../styles/GeneralStylesheet.css";
import "../styles/WelcomePage.css";
import logo from "../resources/FoodCraft-Icon-transparent.png";
import qrCode from "../resources/qr-code.png";
import DropdownBox from "../components/DropdownBox";
import { useNavigate } from "react-router-dom";

export default function WelcomePage(): ReactElement {
    const roles = [
        { label: "Student", value: 'student' },
        { label: "Angestellt", value: 'academic' },
        { label: "Gast", value: 'guest' }
    ];

    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
    const [showModal, setShowModal] = useState(isDesktop);

    useEffect(() => {
        const handleResize = () => {
            const isNowDesktop = window.innerWidth > 768;
            setIsDesktop(isNowDesktop);
            setShowModal(isNowDesktop); // Show modal only on desktop
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navigate = useNavigate();

    const navigateToUniversitySelection = () => { navigate('/university-selection'); };

    const DesktopModal = () => (
        <div className="desktop-modal">
            <div className="ModalContent">
                <img className="qrCodeImg" src={qrCode} alt="qrCode"/>
                <div className="modalText">
                    <p>Für die beste Benutzererfahrung <br/> besuche MealCraft gerne auf deinem Handy. <br/> Scanne
                        hierbei den
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
            <div className="welcome-page-top-margin"></div>
            <header>
                <img src={logo} className="food-craft-icon" alt="( )"/>
                <h1 className="heading">MealCraft</h1>
                <h2 className="sub-heading">Willkommen</h2>
            </header>
            <span className="welcome-paragraph">
                <u><b>Neu hier?</b></u><br />
                Gib uns einige Informationen über dich<br />
                damit wir die App für dich personalisieren können.
            </span>
            <div className="dropdown-box">
                <DropdownBox
                    name="roles"
                    options={roles}
                    defaultValue="student"
                    label="Rolle"
                />
            </div>
            <div className="button-container">
                <button className="continue-button" onClick={navigateToUniversitySelection}>Weiter</button>
            </div>
        </div>
    );
}
