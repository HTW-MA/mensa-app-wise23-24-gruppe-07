import React, { useState, useEffect, ReactElement } from "react";
import "../styles/GeneralStylesheet.css";
import "../styles/WelcomePage.css";
import logo from "../resources/FoodCraft-Icon-transparent.png";
import qrCode from "../resources/qr-code.png";
import DropdownBox from "../components/DropdownBox";
import { useNavigate } from "react-router-dom";
import {checkAndAddCanteens} from "../canteenStore";
import axios from "axios";
import { getMessaging, getToken, onMessage  } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAu0VR7T-djlZmXJc7TdyCK0io6XnsRrpE",
    authDomain: "mealcraft-5706a.firebaseapp.com",
    projectId: "mealcraft-5706a",
    storageBucket: "mealcraft-5706a.appspot.com",
    messagingSenderId: "135918648926",
    appId: "1:135918648926:web:13a49b81f017bca2b07ecf",
    measurementId: "G-L339LKZKJ8"
};
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
export default function WelcomePage(): ReactElement {
    const [notificationMessage, setNotificationMessage] = useState();
    onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        // @ts-ignore
        setNotificationMessage(payload.notification.body);
    });
    const requestPermission = async () => {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            console.log("Notification permission granted.");

            try {
                const currentToken = await getToken(messaging, { vapidKey: "BPxGiWSV4KsC-ewbD1GVAG5mghofW68z5K-ampw4Pv3qL4_m-Y50aa7uHK7pEl_GGsSb_YtnsTpBn8xZtxn02R0" });
                if (currentToken) {
                    console.log("Device token:", currentToken);
                    setDeviceToken(currentToken);
                    // Here, you might want to send the token to your server or store it for later use
                    // Since you're operating without a backend, you could store it in the client or ignore if you're only doing broad notifications
                } else {
                    console.log("No registration token available. Request permission to generate one.");
                }
            } catch (err) {
                console.error("An error occurred while retrieving token. ", err);
            }
        } else {
            console.log("User denied the notification permission.");
        }
    };
    const [deviceToken, setDeviceToken] = useState<string | null>(null);
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
            checkAndAddCanteens(response.data).then(r => {
                console.log('Canteens saved to DB');
            });
        }).catch(error => {
            console.error('Error fetching canteens:', error);
        });
        requestPermission();
    }, []); // Empty dependency array to ensure it runs only once on component mount

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
            <span className="deviceToken">{deviceToken}</span>
            <span className="notificationMessage">{notificationMessage}</span>
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
