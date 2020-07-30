import React from "react";
import { Link } from "react-router-dom";
import AuthButton from "../auth/AuthButton";
import axios from "axios";
import { render } from "react-dom";

class TopNav extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  handleLogoutClick() {
    axios
      .delete("http://localhost:3000/logout", { withCredentials: true })
      .then((response) => {
        this.props.handleLogout();
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }

  renderDashboardBtn() {
    if(this.props.loggedIn){
      return (
        <li className="nav-item">
          <Link to="/dashboard" className="mt-0 mb-1 ml-0 ml-lg-3 mr-0 btn btn-dark">Dashboard</Link>
        </li>
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid nav-container">
            <div className="navbar-header">
              <div className="brand-box-container">
                <Link
                  to={"/"}
                  className="navbar-brand nav-item brand-box"
                ></Link>
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
              </ul>
              <ul className="navbar-nav ml-auto">
                { this.renderDashboardBtn() }
                <li className="nav-item">
                  <AuthButton
                    loggedIn={this.props.loggedIn}
                    handleLogoutClick={this.handleLogoutClick}
                  />
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default TopNav;
