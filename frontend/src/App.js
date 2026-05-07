import logo from "./logo.svg";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import VideoMeet from "./pages/VideoMeet/VideoMeet";
import HomeComponent from "./pages/Home/HomeComponent";
import History from "./pages/History/History";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/home" element={<HomeComponent />} />
          <Route path="/history" element={<History />} />
          <Route path="/:url" element={<VideoMeet />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
