import {} from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faCogs, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { pageRoutes } from 'services/pageRoutes';
import { i18n } from 'utils/i18n';

const SideBar = () => {
  const cssNavClass = (path) =>
    window.location.pathname === path ? 'selected-dashboard-option ' : '';
  const cssNavBase = 'nav-link cursor-pointer col-background pl-3';

  return (
    <>
      <aside className="p-0 col-background">
        <nav className="navbar navbar-expand bg-dashboard-background flex-md-column flex-row mt-4 align-items-start no-sides-padding">
          <div className="collapse navbar-collapse w-100">
            <ul className="flex-md-column flex-row navbar-nav w-100 justify-content-between">
              <li className="nav-item">
                <Link
                  to={pageRoutes.dashboard()}
                  className={`${cssNavClass(pageRoutes.dashboard())} ${cssNavBase}`}
                >
                  <FontAwesomeIcon fixedWidth icon={faCog} aria-hidden="true" />
                  <span className="pl-2">Dashboard</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to={pageRoutes.admins()}
                  className={`${cssNavClass(pageRoutes.admins())} ${cssNavBase}`}
                >
                  <FontAwesomeIcon fixedWidth icon={faUser} aria-hidden="true" />
                  <span className="pl-2">Admin Users</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to={pageRoutes.agents()}
                  className={`${cssNavClass(pageRoutes.agents())} ${cssNavBase}`}
                >
                  <FontAwesomeIcon fixedWidth icon={faUsers} aria-hidden="true" />
                  <span className="pl-2">{i18n.t('ui.dashboard.nav.agents')}</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to={pageRoutes.configurationProfiles()}
                  className={`${cssNavClass(pageRoutes.configurationProfiles())} ${cssNavBase}`}
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
