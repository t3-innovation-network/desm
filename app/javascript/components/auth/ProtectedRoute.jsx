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
    isLoggedIn &&
      /// The signed in user has valid roles
      user.roles !== undefined &&
      /// We allow this route if the allowed roles includes the user roles
      user.roles.some((role) =>
        allowedRoles
          .map((r) => r.toLowerCase())
          .includes(role.name.toLowerCase())
      ) ? (
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
      /// We don't have a valid session, redirect to Home page with a toast message
      <>
        {toast.error(
          `This action is only allowed for ${allowedRoles.join(",")}`
        )}
        <Redirect to="/" />
      </>
    )
  );
};

export default ProtectedRoute;
