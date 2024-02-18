import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import WelcomePage from "./pages/WelcomePage";
import UniversitySelectionPage from "./pages/UniversitySelectionPage";
import CanteenSelectionPage from "./pages/CanteenSelectionPage";
import HomePage from "./pages/HomePage";

export default function App() {
  let pathOfFirstPage = "/";

  return (
      <Router>
        <Routes>
            <Route path="*" element={<Navigate to={pathOfFirstPage} replace />} />
            <Route path="/" element={<WelcomePage />} />
            <Route path="/university-selection" element={<UniversitySelectionPage />} />
            <Route path="/campus-selection" element={<CanteenSelectionPage />} />
            <Route path="/homepage" element={<HomePage />} />
        </Routes>
      </Router>
  );
}


