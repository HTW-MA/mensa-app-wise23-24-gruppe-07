import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import WelcomePage from "./pages/WelcomePage";
import UniversitySelectionPage from "./pages/UniversitySelectionPage";
import CampusSelectionPage from "./pages/CampusSelectionPage";
import Homepage from "./pages/Homepage";
import "/styles/App.css";

export default function App() {
  let pathOfFirstPage = "/";

  return (
      <Router>
        <Routes>
            <Route path="*" element={<Navigate to={pathOfFirstPage} replace />} />
            <Route path="/" element={<WelcomePage />} />
            <Route path="/university-selection" element={<UniversitySelectionPage />} />
            <Route path="/campus-selection" element={<CampusSelectionPage />} />
            <Route path="/homepage" element={<Homepage />} />
        </Routes>
      </Router>
  );
}


