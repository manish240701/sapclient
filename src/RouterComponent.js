import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import GoogleAuthentication from "./pages/GoogleAuthentication";
import AuthorizationCheck from "./components/AuthorizationCheck";
const RouterComponent = () => {
  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/" />;
  };

  return (
    <div className="router-component">
      <Routes>
        <Route path="/" element={<GoogleAuthentication />} />
        <Route
          path="dashboard"
          element={
            <RequireAuth>
              <AuthorizationCheck />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
};

export default RouterComponent;
