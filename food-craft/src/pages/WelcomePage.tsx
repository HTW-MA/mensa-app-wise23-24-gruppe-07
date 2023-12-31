import {ReactElement} from "react";
import "./GeneralStylesheet.css";
import "./WelcomePage.css";
import logo from "../ressources/FoodCraft-Icon-transparent.png";
import DropdownBox from "../components/DropdownBox";
import {useNavigate} from "react-router-dom";

function WelcomePage(): ReactElement {
    const roles = [
        { label: "Student", value: 'student'},
        { label: "Academic", value: 'academic'},
        { label: "Guest", value: 'guest'}
    ]

    const navigate = useNavigate();

    const navigateToUniversitySelection = () => {
        navigate('/university-selection');
    };

    return (
        <div className="page">
            <header>
                <img src={logo} className="food-craft-icon" alt="( )"/>
                <h1 className="heading">MealCraft</h1>
                <h2 className="sub-heading">Welcome</h2>
            </header>
            <div className="welcome-paragraph">
                <p className="welcome-paragraph">
                    <u><b>New here?</b></u><br/>
                    Give us some information about you so<br/>
                    that we can tailor the app to you.
                </p>
            </div>
            <div className="dropdown-box-div">
                <DropdownBox
                    name="cars"
                    options={roles}
                    defaultValue="student"
                    label="Role"
                />
            </div>
            <button className="continue-button" onClick={navigateToUniversitySelection}>Continue</button>

        </div>
    );
}

export default WelcomePage;