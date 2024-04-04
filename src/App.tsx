import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import WelcomePage from "./pages/WelcomePage";
import UniversitySelectionPage from "./pages/UniversitySelectionPage";
import CanteenSelectionPage from "./pages/CanteenSelectionPage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import SavedMealsPage from "./pages/SavedMealsPage";

export default function App() {
  let pathOfFirstPage = "/";

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((err) => {
                console.error('Service Worker registration failed:', err);
            });
    }

  return (
      <Router>
        <Routes>
            <Route path="*" element={<Navigate to={pathOfFirstPage} replace />} />
            <Route path="/" element={<WelcomePage />} />
            <Route path="/university-selection" element={<UniversitySelectionPage />} />
            <Route path="/campus-selection" element={<CanteenSelectionPage />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/saved-meals" element={<SavedMealsPage />} />
        </Routes>
      </Router>
  );
}


