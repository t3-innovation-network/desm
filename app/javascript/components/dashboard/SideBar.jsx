import React, { Component } from 'react';

export default class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  handlePageChangeClick(page) {
    this.props.handlePageChange(page);
  }

  render () {
    return (
      <React.Fragment>
        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
          <div className="sidebar-sticky mt-5">
            <ul className="nav flex-column">
              <li className="nav-item">
                <button className="nav-item active" onClick={() => this.handlePageChangeClick("main")}>
                  <i className="fa fa-home" aria-hidden="true"></i>
                  Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-item" onClick={() => this.handlePageChangeClick("users")}>
                  <i className="fa fa-users" aria-hidden="true"></i>
                  Users
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </React.Fragment>
    )
  }
}