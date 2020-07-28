import React from "react";
import { NavLink, withRouter } from "react-router-dom";

class Navbar extends React.Component {
  getNavLinkClass = (path) => {
    return this.props.location.pathname === path ? "active" : "";
  };
  render() {
    return (
      <nav className="navbar navbar-expand-lg">
        <div className="container nav-container">
          <div className="navbar-header">
            <div className="brand-box-container">
              <a className="navbar-brand nav-item brand-box" href="/"></a>
            </div>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#toggle-nav" aria-controls="toggle-nav" aria-expanded="false" aria-label="Toggle Navigation">
              <i className="fa fa-bars" aria-hidden="true"></i>
            </button>
          </div>
          <div
            className="collapse navbar-collapse"
            id="toggle-nav"
          >
            <ul className="navbar-nav mr-auto">
              <li className={this.getNavLinkClass("/")}>
                <NavLink to="/" className="nav-link">View Mappings</NavLink>
              </li>
              <li className={this.getNavLinkClass("/mappings/new")}>
                <NavLink to="/mappings/new" className="btn btn-outline-secondary">Map a Specification</NavLink>
              </li>
            </ul>
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <NavLink to="/sign-in" className="btn btn-dark">Sign In</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

Navbar = withRouter(Navbar);
export default Navbar;
