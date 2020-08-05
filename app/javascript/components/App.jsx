import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorNotice from "../components/shared/ErrorNotice";
import checkLoginStatus from "./api/checkLoginStatus";
import ErrorMessage from "./helpers/errorMessage";
import { useSelector } from "react-redux";
import { doLogin, setUser } from "../actions/sessions"
import { useDispatch } from "react-redux";
import Routes from "./Routes"

const App = () => {
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const dispatch = useDispatch();

  const [errors, setErrors] = useState("");

  const handleLogin = (data) => {
    dispatch(doLogin());
    dispatch(setUser(data));
    toast.info("Signed In");
  }

  const checkLoginStatusAPI = () => {
    checkLoginStatus({loggedIn: isLoggedIn})
      .then((response) => {
        /// If we have something to change
        if (response !== undefined) {
          dispatch(doLogin());
          dispatch(setUser(response.user));
        }
      })
      /// Process any server errors
      .catch((error) => {
        setErrors(ErrorMessage(error));
      });
  }

  /// Use effect with an emtpy array as second parameter, will trigger the 'checkLoginStatus'
  /// action at the 'mounted' event of this functional component (It's not actually mounted,
  /// but it mimics the same action).
  useEffect(() => {
    checkLoginStatusAPI();
  }, []);

  return (
    <React.Fragment>
      {errors && <ErrorNotice message={errors} />}

      <Routes handleLogin={handleLogin} />
      <ToastContainer />
    </React.Fragment>
  );
}

export default App;
