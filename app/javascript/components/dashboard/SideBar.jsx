import {} from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faCogs, faUser } from '@fortawesome/free-solid-svg-icons';

const SideBar = () => {
  const navLinks = {
    dashboard: '/dashboard',
    users: '/dashboard/users',
    organizations: '/dashboard/organizations',
    configuration_profiles: '/dashboard/configuration-profiles',
    admins: '/dashboard/admins',
  };

  return (
    <>
      <aside className="p-0 col-background">
        <nav className="navbar navbar-expand bg-dashboard-background flex-md-column flex-row mt-4 align-items-start no-sides-padding">
          <div className="collapse navbar-collapse w-100">
            <ul className="flex-md-column flex-row navbar-nav w-100 justify-content-between">
              <li className="nav-item">
                <Link
                  to={navLinks.dashboard}
                  className={`${
                    window.location.pathname === navLinks.dashboard
                      ? 'selected-dashboard-option '
                      : ''
                  }nav-link cursor-pointer col-background pl-3`}
                >
                  <FontAwesomeIcon fixedWidth icon={faCog} aria-hidden="true" />
                  <span className="pl-2">Dashboard</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to={navLinks.admins}
                  className={`${
                    window.location.pathname === navLinks.admins ? 'selected-dashboard-option ' : ''
                  }nav-link cursor-pointer col-background pl-3`}
                >
                  <FontAwesomeIcon fixedWidth icon={faUser} aria-hidden="true" />
                  <span className="pl-2">Admin Users</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to={navLinks.configuration_profiles}
                  className={`${
                    window.location.pathname === navLinks.configuration_profiles
                      ? 'selected-dashboard-option '
                      : ''
                  }nav-link cursor-pointer col-background pl-3`}
                >
                  <FontAwesomeIcon fixedWidth icon={faCogs} aria-hidden="true" />
                  <span className="pl-2">Configuration Profiles</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
};
export default SideBar;
