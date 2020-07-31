import React, { Component } from 'react';
import DashboardContainer from './DashboardContainer';

export default class MainDashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DashboardContainer
        loggedIn={this.props.loggedIn}
        handleLogout={this.props.handleLogout}
      >
        <div className="col-lg-6 mx-auto">
          <div className="card mt-5">
            <div className="card-header">
              <i className="fa fa-book"></i>
              <strong className="pl-2">
                Dashboard
              </strong>
            </div>
          </div>
        </div>
      </DashboardContainer>
    );
  }
}