import React from "react";
import { Link } from "react-router-dom";

const AuthButton = (props) => {
  if (props.loggedIn) {
    return <button className="mt-0 mb-1 ml-0 ml-lg-3 mr-0 btn btn-dark" onClick={() => props.handleLogoutClick()}>Logout</button>;
  } else {
    return <Link to={"/sign-in"} className="mt-0 mb-1 ml-0 ml-lg-3 mr-0 btn btn-dark">Login</Link>;
  }
};

export default AuthButton;
