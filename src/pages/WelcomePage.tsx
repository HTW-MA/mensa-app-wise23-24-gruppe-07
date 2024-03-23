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
        { label: "Academic", value: 'academic' },
        { label: "Guest", value: 'guest' }
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
            <div>
                <p>For the best user experience <br/> please visit MealCraft on a mobile device.</p>
                <button onClick={() => setShowModal(false)}>Continue with Desktop Browser</button>
            </div>
            <img className="qrCodeImg" src={qrCode} alt="qrCode"/>
        </div>
    );

    return (
        <div className="page">
            {showModal && <DesktopModal/>}
            <div className="welcome-page-top-margin"></div>
            <header>
                <img src={logo} className="food-craft-icon" alt="( )" />
                <h1 className="heading">MealCraft</h1>
                <h2 className="sub-heading">Welcome</h2>
            </header>
            <div className="welcome-paragraph">
                <p>
                    <u><b>New here?</b></u><br />
                    Give us some information about you<br />
                    so that we can tailor the app to you.
                </p>
            </div>
            <div className="dropdown-box">
                <DropdownBox
                    name="roles"
                    options={roles}
                    defaultValue="student"
                    label="Role"
                />
            </div>
            <div className="button-container">
                <button className="continue-button" onClick={navigateToUniversitySelection}>Continue</button>
            </div>
        </div>
    );
}
