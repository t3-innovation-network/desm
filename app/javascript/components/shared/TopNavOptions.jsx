import {} from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { useDesktopMediaQuery } from '../../utils/mediaQuery';
import Stepper from './../mapping/Stepper';
import { isAdmin, isMapper } from '../../helpers/Auth';

const TopNavOptions = (props) => {
  const isDesktop = useDesktopMediaQuery();
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const user = useSelector((state) => state.user);

  const isActivePath = (path) => {
    const currentPath = window.location.pathname;
    return currentPath === path || currentPath.match(new RegExp(`${path}(\\?|/|$)`));
  };

  const clsNav = (path) => {
    const isActive = isActivePath(path);

    return classNames('nav-item', {
      'mt-0 ms-lg-3 me-lg-3': isDesktop,
      'selected-item': isDesktop && isActive,
    });
  };

  const clsNavLink = (path) => {
    const isActive = isActivePath(path);

    return classNames('nav-link', {
      active: isActive,
      'fw-bold': isDesktop && isActive,
    });
  };

  return (
    <>
      <ul className="navbar-nav me-auto">
        {props.viewMappings && isLoggedIn && isMapper(user) && (
          <li className={clsNav('/mappings')}>
            <Link
              to="/mappings"
              className={clsNavLink('/mappings')}
              title="See the list of your specifications (and those of your organization)"
            >
              My Mappings
            </Link>
          </li>
        )}
        {props.mapSpecification && isLoggedIn && isMapper(user) && (
          <li className={clsNav('/new-mapping')}>
            <Link
              to="/new-mapping"
              className={clsNavLink('/new-mapping')}
              title="Create a mapping between 2 specifications"
            >
              New Mapping
            </Link>
          </li>
        )}
        {isLoggedIn && isAdmin(user) && (
          <li className={clsNav('/dashboard')}>
            <Link to="/dashboard" className={clsNavLink('/dashboard')}>
              Dashboard
            </Link>
          </li>
        )}
        {props.stepper && (
          <li>
            <Stepper stepperStep={props.stepperStep} mapping={props.mapping} />
          </li>
        )}
      </ul>
      {props.customcontent ? (
        <ul className="navbar-nav me-auto">
          <li className="mt-0 mb-2 ms-0 ms-lg-3 me-0 me-lg-3">{props.customcontent}</li>
        </ul>
      ) : (
        ''
      )}
    </>
  );
};

export default TopNavOptions;
