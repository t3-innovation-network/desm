import React from "react";
import { Link } from "react-router-dom";
import AuthButton from "../auth/AuthButton";
import Stepper from "../mapping/Stepper";
import DashboardBtn from "./DashboardBtn";

const TopNav = () => {
  const currentPage = window.location.pathname;

  return (
    <React.Fragment>
      <nav className="navbar navbar-with-border navbar-expand-lg">
        <div className="container-fluid nav-container">
          <div className="navbar-header">
            <div className="brand-box-container">
              <Link to={"/"} className="navbar-brand nav-item brand-box"></Link>
            </div>

            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#toggle-nav"
              aria-controls="toggle-nav"
              aria-expanded="false"
              aria-label="Toggle Navigation"
            >
              <i className="fa fa-bars" aria-hidden="true"></i>
            </button>
          </div>
          <div className="collapse navbar-collapse" id="toggle-nav">
            <ul className="navbar-nav mr-auto">
              <li
                className={
                  "nav-item current-page mt-0 mb-1 ml-0 ml-lg-3 mr-0 mr-lg-3"
                }
              >
                <Link to={"/"} className="nav-link nav-title-highlited">
                  View Mappings
                </Link>
              </li>
              <li className={"mt-0 mb-1 ml-0 ml-lg-3 mr-0 mr-lg-3 "}>
                <Link
                  to={"/new-mapping"}
                  className="btn wide-btn btn-outline-secondary"
                >
                  Map a Specification
                </Link>
              </li>
              <li>{currentPage == "/new-mapping" && <Stepper />}</li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <DashboardBtn />
              </li>
              <li className="nav-item">
                <AuthButton />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default TopNav;
