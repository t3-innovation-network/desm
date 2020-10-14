import React, { useState, useEffect } from "react";
import AlertNotice from "../components/shared/AlertNotice";
import checkLoginStatus from "./../services/checkLoginStatus";
import { useSelector } from "react-redux";
import { doLogin, setUser } from "../actions/sessions";
import { useDispatch } from "react-redux";
import Routes from "./Routes";
import Loader from "./shared/Loader";
import ReduxToastr from "react-redux-toastr";
import { toastr as toast } from "react-redux-toastr";

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
    await checkLoginStatus({ loggedIn: isLoggedIn }).then((response) => {
      /// Process any server errors
      if (response.error) {
        setErrors(response.error);
        return;
      }
      /// If we have something to change
      if (response.loggedIn) {
        dispatch(doLogin());
        dispatch(setUser(response.user));
      }
      setLoading(false);
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

  return (
    <React.Fragment>
      {loading ? (
        <Loader />
      ) : errors ? (
        <AlertNotice message={errors} />
      ) : (
        <React.Fragment>
          <ReduxToastr position="top-center" className="desm-toast" />
          <Routes handleLogin={handleLogin} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default App;
