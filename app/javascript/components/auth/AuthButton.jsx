import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { doLogout, unsetUser } from '../../actions/sessions';
import signOut from '../../services/signOut';
import { AppContext } from '../../contexts/AppContext';
import { showError } from '../../helpers/Messages';
import { useDesktopMediaQuery } from '../../utils/mediaQuery';

const AuthButton = () => {
  const { setLoggedIn, setCurrentConfigurationProfile } = useContext(AppContext);
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const isDesktop = useDesktopMediaQuery();
  const dispatch = useDispatch();

  const handleLogoutClick = async () => {
    const { error } = await signOut();

    if (error) {
      showError(error);
      return;
    }

    dispatch(doLogout());
    dispatch(unsetUser());
    setCurrentConfigurationProfile(null);
    setLoggedIn(false);

    // Reload the whole app
    window.location = '/';
  };

  /// Show "Sign Out" if the user is already signed in
  if (isLoggedIn) {
    const cls = classNames({
      'mt-0 mb-1 ms-0 ms-lg-3 me-0 btn btn-dark': isDesktop,
      'nav-link btn btn-link': !isDesktop,
    });
    return (
      <button
        className={cls}
        onClick={handleLogoutClick}
        title="Terminate the session. Be sure you saved your changes"
      >
        Sign Out
      </button>
    );
  }
  /// Show "Sing in" except for sign in page
  else if (window.location.href.indexOf('sign-in') === -1) {
    const cls = classNames({
      'mt-0 mb-1 ms-0 ms-lg-3 me-0 btn btn-dark': isDesktop,
      'nav-link': !isDesktop,
    });
    return (
      <Link to={'/sign-in'} className={cls}>
        Sign In
      </Link>
    );
  }
  /// If the user is not signed in, but we are already in the sign in page
  else {
    return '';
  }
};

export default AuthButton;
