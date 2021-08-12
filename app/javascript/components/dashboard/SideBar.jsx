import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  const navLinks = {
    dashboard: "/dashboard",
    users: "/dashboard/users",
    organizations: "/dashboard/organizations",
  };

  return (
    <React.Fragment>
      <aside className="p-0 col-background">
        <nav className="navbar navbar-expand bg-dashboard-background flex-md-column flex-row mt-5 align-items-start no-sides-padding">
          <div className="collapse navbar-collapse w-100">
            <ul className="flex-md-column flex-row navbar-nav w-100 justify-content-between">
              <li className="nav-item">
                <Link
                  to={navLinks.dashboard}
                  className={`${
                    window.location.pathname === navLinks.dashboard
                      ? "selected-dashboard-option "
                      : ""
                  }nav-link cursor-pointer col-background pl-3`}
                >
                  <i className="fa fa-home" aria-hidden="true"></i>
                  <span className="pl-2">Dashboard</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to={navLinks.users}
                  className={`${
                    window.location.pathname.includes(navLinks.users)
                      ? "selected-dashboard-option "
                      : ""
                  }nav-link cursor-pointer col-background pl-3`}
                >
                  <i className="fa fa-users" aria-hidden="true"></i>
                  <span className="pl-2">Users</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to={navLinks.organizations}
                  className={`${
                    window.location.pathname.includes(navLinks.organizations)
                      ? "selected-dashboard-option "
                      : ""
                  }nav-link cursor-pointer col-background pl-3`}
                >
                  <i className="fa fa-building" aria-hidden="true"></i>
                  <span className="pl-2">Organizations</span>
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
