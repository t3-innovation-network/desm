import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { toastr as toast } from "react-redux-toastr";

const ProtectedRoute = ({
  component: Component,
  allowedRoles: allowedRoles = [],
  ...rest
}) => {
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const user = useSelector((state) => state.user);

  return (
    /// If we have a valid session
    isLoggedIn ? (
      /// Go render the route
      <Route
        {...rest}
        render={(props) => (
          <Component
            /// Destructure all the props passed to join with all the rest
            {...rest}
            {...props}
          />
        )}
      />
    ) : (
      /// We don't have a valid session, redirect to SignIn page
      <>
        <Redirect to="/sign-in" />
      </>
    )
  );
};

export default ProtectedRoute;
