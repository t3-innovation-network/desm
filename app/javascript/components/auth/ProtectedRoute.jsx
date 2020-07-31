import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, loggedIn: loggedIn, ...rest }) => {
  return (
    /// If we have a valid session, go render the requested route
    loggedIn ?
      <Route
        {...rest}
        render={props => (
          <Component
          /// We need also the loggedIn variable, so pass it
          loggedIn={loggedIn}
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