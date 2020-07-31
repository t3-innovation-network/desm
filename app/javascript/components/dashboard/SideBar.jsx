import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <React.Fragment>
        <aside className="col-12 col-md-2 p-0 bg-light">
            <nav className="navbar navbar-expand navbar-light bg-light flex-md-column flex-row mt-5 align-items-start">
                <div className="collapse navbar-collapse">
                    <ul className="flex-md-column flex-row navbar-nav w-100 justify-content-between">
                        <li className="nav-item">
                          <Link to="/dashboard" className="nav-link cursor-pointer">
                            <i className="fa fa-home" aria-hidden="true"></i>
                            <span className="pl-2">Dashboard</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link to="dashboard/users" className="nav-link cursor-pointer">
                            <i className="fa fa-users" aria-hidden="true"></i>
                            <span className="pl-2">Users</span>
                          </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </aside>
      </React.Fragment>
    )
  }
}