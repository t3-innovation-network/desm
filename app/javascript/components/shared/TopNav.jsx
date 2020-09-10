import React from "react";
import { Link } from "react-router-dom";
import AuthButton from "../auth/AuthButton";
import DashboardBtn from "./DashboardBtn";
import UserInfo from "../auth/UserInfo";

const TopNav = (props) => {
  return (
    <React.Fragment>
      <nav className="navbar navbar-with-border with-shadow navbar-expand-lg">
        <div className="container-fluid nav-container">
          <div className="navbar-header">

{/* BRAND BOX */}

            <div className="brand-box-container">
              <Link to="/" className="navbar-brand nav-item brand-box"></Link>
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

{/* DYNAMIC CONTENT */}

          <div className="collapse navbar-collapse" id="toggle-nav">
            { props.centerContent() }

{/* SESSION INFO & ACTIONS */}

            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <UserInfo />
              </li>
              <li className="nav-item">
                <DashboardBtn />
              </li>
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
