import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { doLogout, unsetUser } from "../../actions/sessions";
import signOut from "../../services/signOut";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthButton = () => {
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogoutClick = () => {
    signOut()
      .then((response) => {
        if (response.success) {
          dispatch(doLogout());
          dispatch(unsetUser());
          toast.info("Signed Out");
        }
      })
      .catch((error) => {
        toast.error(ErrorMessage(error));
      });
  };

  /// Show "Sign Out" if the user is already signed in
  if (isLoggedIn) {
    return (
      <React.Fragment>
        <a
          className="nav-link dropdown-toggle"
          id="navbarDropdownMenuLink-333"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span className="pr-2 subtitle">{user.fullname}</span>
          <i className="fas fa-user"></i>
        </a>
        <div
          className="dropdown-menu dropdown-menu-right dropdown-default"
          aria-labelledby="navbarDropdownMenuLink-333"
        >
          <button
            className="mt-0 mb-1 ml-0 ml-lg-3 mr-0 btn btn-dark"
            onClick={handleLogoutClick}
          >
            Sign Out
          </button>
        </div>
      </React.Fragment>
    );
  }
  /// Show "Sing in" except for sign in page
  else if (window.location.href.indexOf("sign-in") === -1) {
    return (
      <React.Fragment>
        <Link
          to={"/sign-in"}
          className="mt-0 mb-1 ml-0 ml-lg-3 mr-0 btn btn-dark"
        >
          Sign In
        </Link>
        <ToastContainer />
      </React.Fragment>
    );
  }
  /// If the user is not signed in, but we are already in the sign in page
  else {
    return "";
  }
};

export default AuthButton;
