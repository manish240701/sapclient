import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Signout.css";
import { auth } from "../firebase";
import "../css/App.css";
const SignOut = () => {
  const navigate = useNavigate();
  const handleSignout = () => {
    auth
      .signOut()
      .then(function () {
        // Sign-out successful.
        console.log("success");
        localStorage.removeItem("user");
        localStorage.removeItem("studentSection");
        localStorage.removeItem("studentYear");
        localStorage.removeItem("studentDept");
        navigate("/");
      })
      .catch(function (error) {
        alert("Error signing out");
      });
  };
  return (
    <div className="signout-container">
      <a href="https://www.google.com" target="_blank">
        <button className="help-button button zoom">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="me-2 bi bi-question-circle"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
          </svg>
          Get Help
        </button>
      </a>
      <button className="signout-button button zoom" onClick={handleSignout}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          className="me-2 bi bi-box-arrow-right"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
          />
          <path
            fillRule="evenodd"
            d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
          />
        </svg>
        Log out
      </button>
    </div>
  );
};

export default SignOut;
