import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import UnauthorizedEntry from "../pages/UnauthorizedEntry";
import Dashboard from "../pages/Dashboard";

const AuthorizationCheck = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const pattern = /.+@kongu.edu$/;
  const match = currentUser.email.match(pattern);
  const [isKonguMail, setIsKonguMail] = useState(true);



  const handleDelete = async () => {
    const user = auth.currentUser;
    try {
      await user.delete();
      navigate("/");
      localStorage.removeItem("user");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!match) {
      setIsKonguMail(false);
      setTimeout(() => {
        handleDelete();
      }, 5000);
    }
  },[]);

  return (
    <div>
      {isKonguMail ? (
        <Dashboard/>
      ) : (
        <div className="unauthorised-entry">
          <UnauthorizedEntry deleteAccount = {handleDelete}/>
        </div>
      )}
    </div>
  );
};

export default AuthorizationCheck;
