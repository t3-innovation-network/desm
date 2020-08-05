import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const user = useSelector((state) => state.user);

  return (
    /// If we have a valid session, go render the requested route
    isLoggedIn && user.roles !== undefined && user.roles[0].name == "admin" ?
      <Route
        {...rest}
        render={props => (
          <Component
          /// Destructure all the props passed to join with all the rest
          {...rest}
          {...props}
        />
        )}
      />
    /// If we don't have a valid session, redirect to Sign In page
    : <Redirect to="/sign-in" />
  )
}

export default ProtectedRoute;