import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/home/Home";
import SignIn from "../components/auth/SignIn";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Mapping from "../components/mapping/Mapping";
import MainDashboard from "../components/dashboard/MainDashboard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UsersIndex from '../components/dashboard/users/UsersIndex';
import EditUser from '../components/dashboard/users/EditUser';
import Registration from "./auth/Registration";
import OrganizationsIndex from '../components/dashboard/organizations/OrganizationsIndex';
import EditOrganization from '../components/dashboard/organizations/EditOrganization';
import CreateOrganization from '../components/dashboard/organizations/CreateOrganization';
import ErrorNotice from "../components/shared/ErrorNotice";
import checkLoginStatus from "./api/checkLoginStatus";
import ErrorMessage from "./helpers/errorMessage";
import { useSelector } from "react-redux";
import { doLogin, doLogout, setUser, unsetUser } from "../actions/sessions"
import { useDispatch } from "react-redux";

const App = () => {
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const dispatch = useDispatch();

  const [errors, setErrors] = useState("");

  const handleLogin = (data) => {
    dispatch(doLogin());
    dispatch(setUser(data.user));
    toast.info("Signed In");
  }

  const handleLogout = () => {
    dispatch(doLogout());
    dispatch(unsetUser());
    toast.info("Signed Out");
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

      <Router>
        <Switch>

        <Route exact path={"/"} component={Home} />

        <Route exact path={"/new-mapping"} component={Mapping} />

          <Route
            exact
            path={"/sign-in"}
            render={(props) => (
              <SignIn
                {...props}
                handleLogin={handleLogin}
              />
            )}
          />

          <ProtectedRoute
            exact
            path='/dashboard'
            loggedIn={isLoggedIn}
            handleLogout={handleLogout}
            auth={isLoggedIn}
            component={MainDashboard}
          />

          <ProtectedRoute
            exact
            path='/dashboard/users'
            loggedIn={isLoggedIn}
            handleLogout={handleLogout}
            auth={isLoggedIn}
            component={UsersIndex}
          />

          <ProtectedRoute
            exact
            path='/dashboard/users/new'
            loggedIn={isLoggedIn}
            handleLogout={handleLogout}
            auth={isLoggedIn}
            component={Registration}
          />

          <ProtectedRoute
            exact
            path='/dashboard/users/:id'
            loggedIn={isLoggedIn}
            handleLogout={handleLogout}
            auth={isLoggedIn}
            component={EditUser}
          />

          <ProtectedRoute
            exact
            path='/dashboard/organizations'
            loggedIn={isLoggedIn}
            handleLogout={handleLogout}
            auth={isLoggedIn}
            component={OrganizationsIndex}
          />

          <ProtectedRoute
            exact
            path='/dashboard/organizations/new'
            loggedIn={isLoggedIn}
            handleLogout={handleLogout}
            auth={isLoggedIn}
            component={CreateOrganization}
          />

          <ProtectedRoute
            exact
            path='/dashboard/organizations/:id'
            loggedIn={isLoggedIn}
            handleLogout={handleLogout}
            auth={isLoggedIn}
            component={EditOrganization}
          />

        </Switch>
      </Router>
      <ToastContainer />
    </React.Fragment>
  );
}

export default App;
