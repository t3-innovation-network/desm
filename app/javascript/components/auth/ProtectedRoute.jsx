import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({
  component: Component,
  allowNonAdmins: allowNonAdmins = false,
  ...rest
}) => {
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const user = useSelector((state) => state.user);
  const adminRoleName = process.env.ADMIN_ROLE_NAME || "Admin";
  console.log(adminRoleName);

  return (
    /// If we have a valid session
    isLoggedIn &&
    /// The signed in user has valid roles
      user.roles !== undefined &&
    /// We allow this route for non admins OR the signed in user is an admin
      (allowNonAdmins || user.roles[0].name == adminRoleName) ? (

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
      /// We don't have a valid session, redirect to Sign In page
      <Redirect to="/sign-in" />
    )
  );
};

export default ProtectedRoute;
