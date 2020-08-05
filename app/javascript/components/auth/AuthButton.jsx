import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthButton = (props) => {
  const isLoggedIn = useSelector((state) => state.loggedIn);

  /// Show "Sign Out" if the user is already signed in
  if (isLoggedIn) {
    return (
      <button
        className="mt-0 mb-1 ml-0 ml-lg-3 mr-0 btn btn-dark"
        onClick={() => props.handleLogoutClick()}
      >
        Sign Out
      </button>
    );
  }
  /// Show "Sing in" except for sign in page
  else if (window.location.href.indexOf("sign-in") === -1) {
    return (
      <Link
        to={"/sign-in"}
        className="mt-0 mb-1 ml-0 ml-lg-3 mr-0 btn btn-dark"
      >
        Sign In
      </Link>
    );
  }
  /// If the user is not signed in, but we are already in the sign in page
  else {
    return "";
  }
};

export default AuthButton;
