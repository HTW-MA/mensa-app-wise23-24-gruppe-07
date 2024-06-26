import React, { ReactElement, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import "../styles/MealButtonStyles.css";
import rightArrow2 from "../resources/right-arrow2.png";
import leftArrow3 from "../resources/left-arrow3.png";
import deactivatedLeftArrow2 from "../resources/left-arrow-deactivated2.png";
import deactivatedRightArrow2 from "../resources/right-arrow-deactivated2.png";
import infoIcon from "../resources/info.png";
import axios from "axios";
import "../pages/CanteenSelectionPage.tsx";
import { Canteen, Menu } from "./Interfaces";
import DropdownBox from "../components/DropdownBox";
import clockIcon from "../resources/clock.png";
import bookmarkIcon from "../resources/bookmark.png";
import {
  addMealIdToBookmarkedMealIds,
  readAllBookmarkedMealIdsFromStore,
  removeMealIdFromBookmarkedMealIds
} from "../BookmarkedMealsStore";

import { getCanteenFromPreferences, getUniversityFromPreferences } from "../userPreferencesStore";

export default function HomePage(): ReactElement {

  const handleBookmarkMeal = async (mealId: string, mealName: string, price:string, iconSrc:string) => {
    try {
      const isCurrentlyBookmarked = bookmarkedMeals.includes(mealId);

      if (isCurrentlyBookmarked) {
        await removeMealIdFromBookmarkedMealIds(mealId);
        setBookmarkedMeals((prevBookmarkedMeals) => prevBookmarkedMeals.filter(id => id !== mealId));
      } else {
        await addMealIdToBookmarkedMealIds(mealId, mealName, price, iconSrc);
        setBookmarkedMeals((prevBookmarkedMeals) => [...prevBookmarkedMeals, mealId]);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const mealTypes = [
    { label: "Essen", value: "Essen" },
    { label: "Suppen", value: "Suppen" },
    { label: "Salate", value: "Salate" },
    { label: "Beilagen", value: "Beilagen" },
    { label: "Desserts", value: "Desserts" },
  ];

  const [weekOffset, setWeekOffset] = useState<number>(0);

  const location = useLocation();
  const [university, setUniversity] = useState("");
  const role = location.state?.role as string;
  const [userRole, setUserRole] = useState(role);
  const [userCanteen, setUserCanteen] = React.useState<Canteen>();

  const navigate = useNavigate();
  const navigateToSettingsPage = async () => {
    navigate("/settings", {
      state: { university: university, canteen: userCanteen, role: userRole },
    });
  };
  const navigateToSavedMealsPage = () => {
    navigate("/saved-meals", {
      state: { canteen: userCanteen, university: university, role: userRole },
    });
  };

  const [mealType, setMealType] = useState("Essen");

  const handleMealTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setMealType(event.target.value);
  };

  const handleBadgeClick = (meal:any) => {
    const badges = meal.badges.map((badge:any) => badge.name + ": " + badge.description + "\n").join("\n");
    alert(badges);
  }

  const [date, setDate] = useState(
    convertDateToString(getCurrentlyValidDate()),
  );

  const [menu, setMenu] = React.useState<Menu[]>([]);
  let currentWeek: string[] = getWeekdaysFor(new Date(date));

  const [useEffectHookTrigger, setUseEffectHookTrigger] = useState(0);
  const [bookmarkedMeals, setBookmarkedMeals] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get(
        "https://mensa.gregorflachs.de/api/v1/menue?canteenId=" +
          userCanteen?.id +
          "&startdate=" +
          date +
          "&enddate=" +
          date,
        { headers: { "X-API-KEY": process.env.REACT_APP_API_KEY } },
      )
      .then((response) => {
        setMenu(response.data);
        console.log(response.data);
      });
  }, [useEffectHookTrigger, date, userCanteen?.id]);

  useEffect(() => {
    const fetchBookmarkedMeals = async () => {
      try {
        const mealIds = await readAllBookmarkedMealIdsFromStore();
        console.log(mealIds);
        setBookmarkedMeals(mealIds);
      } catch (error) {
        console.error("Error fetching bookmarked meals:", error);
      }
    };
    fetchBookmarkedMeals().then(r => console.log("Bookmarked meals fetched!"));
  }, []);

  useEffect(() => {
    getCanteenFromPreferences().then(canteen => {
      setUserCanteen(canteen);
      axios
          .get(
              "https://mensa.gregorflachs.de/api/v1/menue?canteenId=" +
              canteen.id +
              "&startdate=" +
              date +
              "&enddate=" +
              date,
              { headers: { "X-API-KEY": process.env.REACT_APP_API_KEY } },
          )
          .then((response) => {
            setMenu(response.data);
            console.log(response.data);
          });
    });
    getUniversityFromPreferences().then(university => {
        setUniversity(university);
    });
  }, []);

  const loadPreviousWeek = () => {
    if (weekOffset === 0) return;
    currentWeek = offsetWeekBy(-1);
  };

  const loadNextWeek = () => {
    if (weekOffset === 1) return;
    currentWeek = offsetWeekBy(1);
  };

  function offsetWeekBy(offset: number): string[] {
    // offset: -1 = previous week, 1 = next week etc.
    let offsetDate = new Date(date); // copy to not change provided date

    offsetDate.setDate(offsetDate.getDate() + offset * 7);
    setDate(convertDateToString(offsetDate));

    setUseEffectHookTrigger((prev) => prev + 1);
    setWeekOffset(weekOffset + offset);
    return getWeekdaysFor(offsetDate);
  }

  function getCurrentlyValidDate(): Date {
    let currentDate = new Date();
    let hourOfCanteenClosure = 18;

    if (currentDate.getHours() >= hourOfCanteenClosure)
      currentDate.setDate(currentDate.getDate() + 1);

    // Skip Saturdays and Sundays
    while (currentDate.getDay() === 0 || currentDate.getDay() === 6)
      currentDate.setDate(currentDate.getDate() + 1);

    return currentDate;
  }

  function convertDateToString(date: Date): string {
    // Format the date as YYYY-MM-DD
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Add 1 because months are zero-based
    const day = date.getDate();

    // Ensure month and day are two digits (von 2024-2-9 zu 2024-02-09)
    const formattedMonth = month.toString().padStart(2, "0"); // padStart fügt 0 vorne an, wenn die Länge des Strings kleiner als 2 ist
    const formattedDay = day.toString().padStart(2, "0");

    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  function getReformattedDate(date: string) {
    const parts = date.split("-");
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }

  function getWeekdaysFor(date: Date) {
    const dayOfWeek = date.getDay();
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Assuming getDate never returns a weekend date, but keeping logic for safety.
    const monday = new Date(date.setDate(date.getDate() - offset));

    const weekdays = [];
    for (let i = 0; i < 5; i++) {
      // Iterate from Monday to Friday
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      weekdays.push(nextDay.toISOString().substring(0, 10)); // toISOString returns a string in the format "YYYY-MM-DDTHH:MM:SS.sssZ"
    }
    return weekdays;
  }

  interface BadgeIconMapping {
    [key: string]: string;
  }

  const badgeIconMapping: BadgeIconMapping = {
    Vegan: "vegan.png",
    Vegetarisch: "vegetarisch.png",
    "Nachhaltige Fischerei": "fish.png",
  };

  const [showInfoModal, setShowInfoModal] = useState(false);

  const climateIcon = `${process.env.PUBLIC_URL}/Klimaessen.png`;
  const co2AIcon = `${process.env.PUBLIC_URL}/CO2_bewertung_A.png`;
  const co2BIcon = `${process.env.PUBLIC_URL}/CO2_bewertung_B.png`;
  const co2CIcon = `${process.env.PUBLIC_URL}/CO2_bewertung_C.png`;
  const h2oAIcon = `${process.env.PUBLIC_URL}/H2O_bewertung_A.png`;
  const h2oBIcon = `${process.env.PUBLIC_URL}/H2O_bewertung_B.png`;
  const h2oCIcon = `${process.env.PUBLIC_URL}/H2O_bewertung_C.png`;
  const vegetarianIcon = `${process.env.PUBLIC_URL}/vegetarisch.png`;
  const veganIcon = `${process.env.PUBLIC_URL}/vegan.png`;
  const meatIcon = `${process.env.PUBLIC_URL}/fleisch.png`;
  const greenIcon = `${process.env.PUBLIC_URL}/Grüner Ampelpunkt.png`;
  const yellowIcon = `${process.env.PUBLIC_URL}/Gelber Ampelpunkt.png`;
  const redIcon = `${process.env.PUBLIC_URL}/Roter Ampelpunkt.png`;

  const handleAdditivesClick = (meal:any) => {
    let additives = meal.additives.map((additive:any) => (additive.referenceid + ": " + additive.text)).join("\n");
    alert("Zusatzstoffe:\n" + additives);
  }

  return (
    <div className="homepage">
      <header className="header">
        <div className="speiseplan-div">
          <p className="speiseplan-tag">Speiseplan</p>
          <button className="infoButton" onClick={() => setShowInfoModal(true)}>
          </button>
        </div>
        <div className="weekdays-buttons">
          <button onClick={loadPreviousWeek} className="changeWeekButton">
            <img
              className="arrow"
              src={weekOffset === 0 ? deactivatedLeftArrow2 : leftArrow3}
              alt="arrow"
            />
          </button>
          {currentWeek.map((day, index) => (
            <button
              key={index}
              className={`weekday-button ${date === day ? "selected" : day === convertDateToString(new Date()) ? "current-day" : ""}`}
              onClick={() => {
                setDate(day);
                console.log("weekday button clicked: " + day);
                setUseEffectHookTrigger((prev) => prev + 1);
              }}
            >
              {new Date(day).toLocaleDateString("de-DE", {
                weekday: "short",
              })}
            </button>
          ))}
          <button onClick={loadNextWeek} className="changeWeekButton">
            <img
              className="arrow"
              src={weekOffset === 1 ? deactivatedRightArrow2 : rightArrow2}
              alt="arrow"
            />
          </button>
        </div>
      </header>
      <div className="homebody">
        <div className="nameDiv">
          <p className="canteenName">{userCanteen?.name}</p>
          <p className="date">{getReformattedDate(date)}</p>
        </div>
        <div className="meal-type-selection">
          <DropdownBox
            name="Art"
            options={mealTypes}
            label="Kategorie"
            value={mealType}
            onChange={handleMealTypeChange}
          />
        </div>
        <div className="meal-list">
          {menu.length > 0 &&
          menu.some((menuItem) => menuItem.meals.length > 0) ? (
            menu.map((menuItem) =>
              menuItem.meals
                .filter((meal) => meal.category === mealType)
                .map((meal) => {
                  let badgeName;
                  if (meal.badges.length === 1) badgeName = meal.badges[0].name;
                  else badgeName = meal.badges[1].name;
                  const iconFileName = badgeIconMapping[badgeName];
                  const iconSrc = iconFileName
                    ? `${process.env.PUBLIC_URL}/${iconFileName}`
                    : `${process.env.PUBLIC_URL}/fleisch.png`;

                  //filename for co2 badge
                  let co2Src: string = `${process.env.PUBLIC_URL}/`;
                  //is there a CO2 badge?
                  const foundCO2 = meal.badges.find(
                    (badge) =>
                      badge.name === "CO2_bewertung_A" ||
                      badge.name === "CO2_bewertung_B" ||
                      badge.name === "CO2_bewertung_C",
                  );
                  //if yes, add the filename to the path
                  if (foundCO2) co2Src += foundCO2.name + ".png";
                  //if no, add the path to the white background badge
                  else co2Src += "whiteBackground.jpg";

                  let h2oSrc: string = `${process.env.PUBLIC_URL}/`;
                  const foundH2O = meal.badges.find(
                    (badge) =>
                      badge.name === "H2O_bewertung_A" ||
                      badge.name === "H2O_bewertung_B" ||
                      badge.name === "H2O_bewertung_C",
                  );
                  if (foundH2O) h2oSrc += foundH2O.name + ".png";
                  else h2oSrc += "whiteBackground.jpg";

                  let climateIconSrc = `${process.env.PUBLIC_URL}/`;
                  const foundClimateIcon = meal.badges.find(
                    (badge) => badge.name === "Klimaessen",
                  );
                  if (foundClimateIcon)
                    climateIconSrc += foundClimateIcon.name + ".png";
                  else climateIconSrc += "whiteBackground.jpg";

                  let price = "";

                  try {
                    if (role === "Student") price = parseFloat(String(meal.prices[0].price)).toFixed(2) + "€";
                    else if (role === "Angestellt") price = parseFloat(String(meal.prices[1].price)).toFixed(2) + "€";
                    else price = parseFloat(String(meal.prices[2].price)).toFixed(2) + "€";
                  } catch (error) {
                    console.error("Error getting price:", error);
                  }

                  const isBookmarked = bookmarkedMeals.includes(meal.id);

                  const additiv = meal.additives.map((additive) => additive.referenceid).join(", ");

                  return (
                    <div className="mealButton" key={meal.id}>
                      <img className="veganIcon" src={iconSrc} alt={badgeName}/>
                      <div className="mealNameCo2Div">
                        <span className="mealName">{meal.name}</span>
                        <button className="badgeButton" onClick={() => handleBadgeClick(meal)}>
                          <img className="badgeImg" src={co2Src} alt="CO2_bewertung"></img>
                          <img className="badgeImg" src={h2oSrc} alt="H2O_bewertung"></img>
                          <img className="badgeImg" src={climateIconSrc} alt="Klimaessen"></img>
                        </button>
                        <button className="additives" onClick={() => handleAdditivesClick(meal)}>{additiv}</button>
                      </div>
                      <div className="bookmarkAndPriceDiv">
                        {
                          isBookmarked ?
                              <button className="bookmarkButton" onClick={() => handleBookmarkMeal(meal.id, meal.name, price, iconSrc)}><img className="bookmarkImg" src={`${process.env.PUBLIC_URL}/saved.png`} alt="Bookmark"/></button>
                              :
                              <button className="bookmarkButton" onClick={() => handleBookmarkMeal(meal.id, meal.name, price, iconSrc)}><img className="bookmarkImg" src={bookmarkIcon} alt="Bookmark"/></button>
                        }
                        <span className="mealPrice">{price}</span>
                      </div>
                    </div>
                  );
                }),
            )
          ) : (
            <div className="no-menu-div">
              <img
                src={`${process.env.PUBLIC_URL}/no-menu.png`}
                alt="noMenuIcon"
                className="no-menu-icon"
              />
              <p className="no-menu-message">
                Für diesen Tag gibt es keinen Speiseplan.
              </p>
            </div>
          )}
        </div>
      </div>
      <footer>
        <div className="footer-div">
          <button className="footer-button selected">
            <img
              className="buttonIcon"
              src={`${process.env.PUBLIC_URL}/heim-selected.png`}
              alt="settingsIcon"
            />
            <p>Speiseplan</p>
          </button>
          <button className="footer-button" onClick={navigateToSettingsPage}>
            <img
              className="buttonIcon"
              src={`${process.env.PUBLIC_URL}/settings.png`}
              alt="settingsIcon"
            />
            <p>Einstellungen</p>
          </button>
          <button className="footer-button" onClick={navigateToSavedMealsPage}>
            <img
              className="buttonIcon"
              src={`${process.env.PUBLIC_URL}/lesezeichen.png`}
              alt="bookmarkIcon"
            />
            <p>Gespeichert</p>
          </button>
        </div>
      </footer>
    </div>
  );
}
