import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { doLogout, unsetUser } from "../../actions/sessions";
import signOut from "../../services/signOut";
import { toastr as toast } from "react-redux-toastr";
import { AppContext } from "../../contexts/AppContext";

const AuthButton = () => {
  const { setLoggedIn } = useContext(AppContext);
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const dispatch = useDispatch();

  const handleLogoutClick = async () => {
    const { error } = await signOut();

    if (error) {
      toast.error(error);
      return;
    }

    dispatch(doLogout());
    dispatch(unsetUser());
    setLoggedIn(false);
    toast.info("Signed Out");
  };

  /// Show "Sign Out" if the user is already signed in
  if (isLoggedIn) {
    return (
      <button
        className="mt-0 mb-1 ml-0 ml-lg-3 mr-0 btn btn-dark"
        onClick={handleLogoutClick}
        data-toggle="tooltip"
        data-placement="bottom"
        title="Terminate the session. Be sure you saved your changes"
      >
        Sign Out
      </button>
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
      </React.Fragment>
    );
  }
  /// If the user is not signed in, but we are already in the sign in page
  else {
    return "";
  }
};

export default AuthButton;
