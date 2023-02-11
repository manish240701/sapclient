import React from "react";
import { useNavigate } from "react-router-dom";
import loginerror from "../assets/login-error.png"
import "../css/UnauthorizedEntry.css"
const UnauthorizedEntry = ({deleteAccount}) => {

  const navigate = useNavigate();
  return (
    <div className="unauthorized-entry-body">
      <div className="error-container">
        {/* error message  */}
        <img src={loginerror} alt="login error" width="60%" />
        <h3 className="unauthorized-error">Access granted only to KONGU mail id</h3>
        <p>You will be redirected to the login within 5 seconds</p>
        {/* redirect button  */}
        <button
          className="mt-3 redirect-login-btn"
          onClick={() => {
            deleteAccount();
            navigate("/");
          }}
        >
          Return to login page
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedEntry;
