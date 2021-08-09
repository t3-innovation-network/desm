import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <React.Fragment>
      <aside className="p-0 col-background">
        <nav className="navbar navbar-expand navbar-light bg-dashboard-background flex-md-column flex-row mt-5 align-items-start">
          <div className="collapse navbar-collapse w-100">
            <ul className="flex-md-column flex-row navbar-nav w-100 justify-content-between">
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className="nav-link cursor-pointer col-background"
                >
                  <i className="fa fa-home" aria-hidden="true"></i>
                  <span className="pl-2">Dashboard</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to={"/dashboard/users"}
                  className="nav-link cursor-pointer col-background"
                >
                  <i className="fa fa-users" aria-hidden="true"></i>
                  <span className="pl-2">Users</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to={"/dashboard/organizations"}
                  className="nav-link cursor-pointer col-background"
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
