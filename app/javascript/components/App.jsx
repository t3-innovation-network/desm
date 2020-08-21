import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorNotice from "../components/shared/ErrorNotice";
import checkLoginStatus from "./../services/checkLoginStatus";
import ErrorMessage from "./shared/ErrorMessage";
import { useSelector } from "react-redux";
import { doLogin, setUser } from "../actions/sessions";
import { useDispatch } from "react-redux";
import Routes from "./Routes";
import Loader from "./shared/Loader";

const App = () => {
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const dispatch = useDispatch();

  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(true);

  const handleLogin = (data) => {
    dispatch(doLogin());
    dispatch(setUser(data));
    toast.info("Signed In");
  };

  const checkLoginStatusAPI = async () => {
    await checkLoginStatus({ loggedIn: isLoggedIn })
      .then((response) => {
        /// If we have something to change
        if ((response !== undefined)&&(response.user.logged_in !== false)) {
          dispatch(doLogin());
          dispatch(setUser(response.user));
        }
        setLoading(false);
      })
      /// Process any server errors
      .catch((error) => {
        setErrors(ErrorMessage(error));
      });
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'checkLoginStatus'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  useEffect(() => {
    checkLoginStatusAPI();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <React.Fragment>
      {errors && <ErrorNotice message={errors} />}

      <Routes handleLogin={handleLogin} />
      <ToastContainer />
    </React.Fragment>
  );
};

export default App;
