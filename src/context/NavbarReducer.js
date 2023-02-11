const NavbarReducer = (state, action) => {
    switch (action.type) {
      case "YES": {
        return {
          isNavbarOpen : true,
        };
      }
      case "NO": {
        return {
          isNavbarOpen : false,
        };
      }
      default:
        return state;
    }
  };
  
  export default NavbarReducer;