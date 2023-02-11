//import dependencies
import React, { useContext, useState } from "react";

//import components
import { NavbarContext } from "../context/NavbarContext";
import "../css/Navbar.css";

import NavComponent1 from "./NavComponent1";
import NavComponent2 from "./NavComponent2";
import NavComponent3 from "./NavComponent3";
import NavComponent4 from "./NavComponent4";
import NavComponent5 from "./NavComponent5";
import NavComponent6 from "./NavComponent6";
import NavComponent7 from "./NavComponent7";
import NavComponent8 from "./NavComponent8";
import NavComponent9 from "./NavComponent9";
import NavComponent10 from "./NavComponent10";
import NavComponent11 from "./NavComponent11";
import NavComponent12 from "./NavComponent12";
//code

const Navbar = ({ setNavId }) => {
  //states
  const [openNavbar, setOpenNavbar] = useState(true);
  const { dispatch } = useContext(NavbarContext);
  const { isNavbarOpen } = useContext(NavbarContext);
  const [isActive, setIsActive] = useState("nav1");
  //handlers
  const handleBreadcrumb = () => {
    setOpenNavbar(!openNavbar);
    dispatch({ type: openNavbar ? "NO" : "YES" });
  };

  return (
    <div
      className={
        isNavbarOpen
          ? "open-nav fixed-navbar"
          : "close-nav fixed-navbar"
      }
    >
      <div className="navbar-container">
        <div className="app-header">
          {/* breadcrumb  */}
          <div
            className={
              isNavbarOpen
                ? "breadcrumb-container"
                : "breadcrumb-container closed-breadcrumb-container"
            }
            onClick={handleBreadcrumb}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35px"
              height="35px"
              fill="currentColor"
              className={
                isNavbarOpen
                  ? "bi bi-list custom-breadcrumb open-breadcrumb"
                  : "bi bi-list custom-breadcrumb closed-breadcrumb"
              }
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </div>
        </div>

        {isNavbarOpen && (
          <div className="nav-items-container">
            <div className="nav-items">
              <li
                className={isActive === "nav1" ? "active" : ""}
                onClick={() => {
                  setIsActive("nav1");
                  setNavId(<NavComponent1 />);
                }}
              >
                Paper Presentation
              </li>
              <li
                className={isActive === "nav2" ? "active" : ""}
                onClick={() => {
                  setIsActive("nav2");
                  setNavId(<NavComponent2 />);
                }}
              >
                Project Presentation
              </li>
              <li
                className={isActive === "nav3" ? "active" : ""}
                onClick={() => {
                  setIsActive("nav3");
                  setNavId(<NavComponent3 />);
                }}
              >
                Techo Managerial Events
              </li>
              <li
                className={isActive === "nav4" ? "active" : ""}
                onClick={() => {
                  setIsActive("nav4");
                  setNavId(<NavComponent4 />);
                }}
              >
                Sports and Games
              </li>
              <li
                className={isActive === "nav5" ? "active" : ""}
                onClick={() => {
                  setIsActive("nav5");
                  setNavId(<NavComponent5 />);
                }}
              >
                Membership
              </li>
              <li
                className={isActive === "nav6" ? "active" : ""}
                onClick={() => {
                  setIsActive("nav6");
                  setNavId(<NavComponent6 />);
                }}
              >
                Leadership/Oganizing Events
              </li>
              <li
                className={isActive === "nav7" ? "active" : ""}
                onClick={() => {
                  setIsActive("nav7");
                  setNavId(<NavComponent7 />);
                }}
              >
                VAC/Online Courses
              </li>
              <li
                className={isActive === "nav8" ? "active" : ""}
                onClick={() => {
                  setIsActive("nav8");
                  setNavId(<NavComponent8 />);
                }}
              >
                Project to Paper/Patent/Copyright
              </li>
              <li
                className={isActive === "nav9" ? "active" : ""}
                onClick={() => {
                  setIsActive("nav9");
                  setNavId(<NavComponent9 />);
                }}
              >
                GATE/CAT/Govt Exams
              </li>
              <li
                className={isActive === "nav10" ? "active" : ""}
                onClick={() => {
                  setIsActive("nav10");
                  setNavId(<NavComponent10 />);
                }}
              >
                Placement and Internship
              </li>
              <li
                className={isActive === "nav11" ? "active" : ""}
                onClick={() => {
                  setIsActive("nav11");
                  setNavId(<NavComponent11 />);
                }}
              >
                Entrepreneurship
              </li>
              <li
                className={isActive === "nav12" ? "active" : ""}
                onClick={() => {
                  setIsActive("nav12");
                  setNavId(<NavComponent12 />);
                }}
              >
                Social Activities
              </li>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
