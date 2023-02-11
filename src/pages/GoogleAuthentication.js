import React, { useContext, useState } from "react";
import { auth } from "../firebase.js";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../css/Login.css";
import "../css/App.css";
import googlelogo from "../assets/googlelogo.png";
import logo from "../assets/logo.png";
const GoogleAuthentication = () => {
  const provider = new GoogleAuthProvider();
  const [error, setError] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleAuth = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        const user = result.user;
        console.log(user);
        console.log(user.email)
        dispatch({ type: "LOGIN", payload: user });
        navigate("/dashboard");
      })
      .catch((error) => {
        const errorMessage = error.message;
        // const errorCode = error.code;
        // const email = error.customData.email;
        // const credential = GoogleAuthProvider.credentialFromError(error);
        setError(errorMessage);
      });
  };
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-headers mb-2">
          <img src={logo} className="logo" alt="kongu logo" />
          <h3>Welcome back!</h3>
          <p className="p">We are so excited to see you again</p>
        </div>
        <div className="google-auth-container" onClick={handleAuth}>
          <img src={googlelogo} className="googlelogo"  alt="signinimage" />
          <div className="signin-button-text ms-2"> Sign in with Google account</div>
        </div>
        {error && <p className="login-error">{error}</p>}
      </div>
      <div className="footer">
        Designed and developed by Manish
      </div>
    </div>
  );
};

export default GoogleAuthentication;
