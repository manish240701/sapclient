import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { NavbarContextProvider } from "./context/NavbarContext";
import { BrowserRouter, Routes } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import RouterComponent from "./RouterComponent";
import Data from "./components/Data";
import Dashboard from "./pages/Dashboard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>    
        <NavbarContextProvider>
          <ToastContainer
            position="top-right"
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
            <RouterComponent/>
          <ToastContainer />
        </NavbarContextProvider> 
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
