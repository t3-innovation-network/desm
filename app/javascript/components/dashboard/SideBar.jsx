import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs } from "@fortawesome/free-solid-svg-icons";

const SideBar = () => {
  const navLinks = {
    dashboard: "/dashboard",
    users: "/dashboard/users",
    organizations: "/dashboard/organizations",
    configuration_profiles: "/dashboard/configuration-profiles",
  };

  return (
    <React.Fragment>
      <aside className="p-0 col-background">
        <nav className="navbar navbar-expand bg-dashboard-background flex-md-column flex-row mt-5 align-items-start no-sides-padding">
          <div className="collapse navbar-collapse w-100">
            <ul className="flex-md-column flex-row navbar-nav w-100 justify-content-between">
              <li className="nav-item">
                <Link
                  to={navLinks.configuration_profiles}
                  className={`${
                    window.location.pathname === navLinks.configuration_profiles
                      ? "selected-dashboard-option "
                      : ""
                  }nav-link cursor-pointer col-background pl-3`}
                >
                  <FontAwesomeIcon icon={faCogs} aria-hidden="true" />
                  <span className="pl-2">Configuration Profiles</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </React.Fragment>
  );
};
export default SideBar;
