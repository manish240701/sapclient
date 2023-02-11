import React, { useContext } from 'react'
import { NavbarContext } from '../context/NavbarContext';
import "../css/App.css";
import "../css/Body.css"
import "../css/Navbar.css"
import SignOut from './SignOut';
const Body = ({navId}) => {
 const {isNavbarOpen} = useContext(NavbarContext)
  return (
    <div className={isNavbarOpen?"body-shrink body-container":"body-full-width body-container" }>
        <SignOut/>
        {navId}
    </div>
  )
}

export default Body