import React from "react";
import { NavLink, withRouter } from "react-router-dom";

class Navbar extends React.Component {
  getNavLinkClass = (path) => {
    return this.props.location.pathname === path ? "active" : "";
  };
  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid nav-container">
            <div className="navbar-header">
              <div className="brand-box-container">
                <NavLink
                  to={"/"}
                  className="navbar-brand nav-item brand-box"
                ></NavLink>
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
                    "nav-item current-page mt-0 mb-1 ml-0 ml-lg-3 mr-0 mr-lg-3" +
                    this.getNavLinkClass("/")
                  }
                >
                  <NavLink to={"/"} className="nav-link nav-title-highlited">
                    View Mappings
                  </NavLink>
                </li>
                <li
                  className={
                    "mt-0 mb-1 ml-0 ml-lg-3 mr-0 mr-lg-3 " +
                    this.getNavLinkClass("/new-mapping")
                  }
                >
                  <NavLink
                    to={"/new-mapping"}
                    className="btn wide-btn btn-outline-secondary"
                  >
                    Map a Specification
                  </NavLink>
                </li>
              </ul>
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <NavLink
                    to={"/sign-in"}
                    className="mt-0 mb-1 ml-0 ml-lg-3 mr-0 btn btn-dark"
                  >
                    Sign In
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

Navbar = withRouter(Navbar);
export default Navbar;