import { createContext, useEffect, useReducer } from "react";
import NavbarReducer from "./NavbarReducer";

const INITIAL_STATE = {
  isNavbarOpen : true,
};

export const NavbarContext = createContext(INITIAL_STATE);

export const NavbarContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(NavbarReducer, INITIAL_STATE);

  return (
    <NavbarContext.Provider value={{ isNavbarOpen: state.isNavbarOpen, dispatch }}>
      {children}
    </NavbarContext.Provider>
  );
};
