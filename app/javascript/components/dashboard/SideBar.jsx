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
        <aside className="col-12 col-md-2 p-0 bg-light">
            <nav className="navbar navbar-expand navbar-light bg-light flex-md-column flex-row mt-5 align-items-start">
                <div className="collapse navbar-collapse">
                    <ul className="flex-md-column flex-row navbar-nav w-100 justify-content-between">
                        <li className="nav-item">
                          <a className="nav-link cursor-pointer" onClick={() => this.handlePageChangeClick("main")}>
                            <i className="fa fa-home" aria-hidden="true"></i>
                            <span className="pl-2">Dashboard</span>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link cursor-pointer" onClick={() => this.handlePageChangeClick("users")}>
                            <i className="fa fa-users" aria-hidden="true"></i>
                            <span className="pl-2">Users</span>
                          </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </aside>
      </React.Fragment>
    )
  }
}