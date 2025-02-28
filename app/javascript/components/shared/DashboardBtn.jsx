import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDesktopMediaQuery } from '../../utils/mediaQuery';
import classNames from 'classnames';

const DashboardBtn = () => {
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const user = useSelector((state) => state.user);
  const isDesktop = useDesktopMediaQuery();
  // TODO: check if it'll work the same way if to move from webpacker
  const adminRoleName = process.env.ADMIN_ROLE_NAME || 'Super Admin'; // eslint-disable-line no-undef

  if (
    isLoggedIn &&
    user.roles !== undefined &&
    user.roles[0].name.toLowerCase() == adminRoleName.toLowerCase()
  ) {
    const cls = classNames({
      'mt-0 mb-1 ms-0 ms-lg-3 me-0 btn btn-dark': isDesktop,
      'nav-link': !isDesktop,
    });
    return (
      <Link to="/dashboard" className={cls}>
        Dashboard
      </Link>
    );
  }
  return null;
};

export default DashboardBtn;
