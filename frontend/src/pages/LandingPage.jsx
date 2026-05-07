import React from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const router = useNavigate();
  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>Apna Zoom</h2>
        </div>
        <div className="navList">
          <p
            onClick={() => {
              router("/aljk23");
            }}
          >
            Join as Guest
          </p>
          <p
            onClick={() => {
              router("/auth");
            }}
          >
            Login
          </p>
          <div role="button">
            <p
              onClick={() => {
                router("/auth");
              }}
            >
              Register
            </p>
          </div>
        </div>
      </nav>
      <div className="landingMainContainer">
        <div>
          <h1>
            <span style={{ color: "#FF9839" }}>Connect </span> with your loved
            Ones
          </h1>
          <p>Cover a distance by Apna Zoom</p>
          <div role="button">
            <Link to="/auth">Get Started</Link>
          </div>
        </div>
        <div>
          <img src="/mobile.png" alt="landing" />
        </div>
      </div>
    </div>
  );
}
