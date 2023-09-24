import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthButton from "../auth/AuthButton";
import DashboardBtn from "./DashboardBtn";
import UserInfo from "../auth/UserInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../../contexts/AppContext";

const TopNav = (props) => {
  const { hideLogo } = useContext(AppContext);

  return (
    <React.Fragment>
      <nav className="navbar navbar-with-border with-shadow navbar-expand-lg pr-3">
        <div className="col-sm-6 col-md-3 col-lg-2">
          <div className="navbar-header">
            {/* BRAND BOX */}

            <div className="brand-box-container">
              <Link
                className="navbar-brand nav-item brand-box"
                style={ hideLogo ? { backgroundSize: "0 0 " } : {}}
                to="/"
              />
            </div>
          </div>
        </div>

        {/* DYNAMIC CONTENT */}

        <div className="col-sm-6 col-md-9 col-lg-10">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#toggle-nav"
            aria-controls="toggle-nav"
            aria-expanded="false"
            aria-label="Toggle Navigation"
          >
            <FontAwesomeIcon icon={faBars} aria-hidden="true" />
          </button>

          <div className="collapse navbar-collapse" id="toggle-nav">
            {props.centerContent()}

            {/* SESSION INFO & ACTIONS */}

            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <UserInfo />
              </li>
              {!window.location.pathname.includes("dashboard") && (
                <li className="nav-item">
                  <DashboardBtn />
                </li>
              )}
              <li className="nav-item">
                <AuthButton />
              </li>
            </ul>

            {/* END SESSION INFO & ACTIONS */}
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default TopNav;
