import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { snakeCase } from 'lodash';
import { showError } from '../../helpers/Messages';
import { i18n } from '../../utils/i18n';

const ProtectedRoute = ({
  component: Component,
  allowedRoles: allowedRoles = [],
  pageType = 'default',
  ...rest
}) => {
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const user = useSelector((state) => state.user);
  const key = snakeCase(pageType);

  return (
    /// If we have a valid session
    isLoggedIn ? (
      /// The signed in user has valid roles
      user.roles !== undefined &&
      /// We allow this route if the allowed roles includes the user roles
      user.roles.some((role) =>
        allowedRoles.map((r) => r.toLowerCase()).includes(role.name.toLowerCase())
      ) ? (
        /// Go render the route
        <Route
          {...rest}
          render={(props) => (
            <>
              <Helmet>
                <title>{i18n.t(`ui.pages.${key}.title`)}</title>
                <description>{i18n.t(`ui.pages.${key}.description`)}</description>
              </Helmet>
              <Component
                /// Destructure all the props passed to join with all the rest
                {...rest}
                {...props}
              />
            </>
          )}
        />
      ) : (
        /// The role is not allowed, redirect to the home page with a toast message
        <>
          {showError(`This action is only allowed for ${allowedRoles.join(',')}`)}
          <Redirect to="/" />
        </>
      )
    ) : (
      /// We don't have a valid session, redirect to SignIn page
      <>
        <Redirect to="/sign-in" />
      </>
    )
  );
};

export default ProtectedRoute;
