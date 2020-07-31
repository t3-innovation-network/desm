import React from 'react';
import TopNav from '../shared/TopNav';
import SideBar from '../dashboard/SideBar';

const DashboardContainer = (props) => {
  return <React.Fragment>
    <div className="wrapper">
      <TopNav
        loggedIn={props.loggedIn}
        handleLogout={props.handleLogout}
      />
      <div className="container-fluid container-wrapper">
        <div className="row">
          <SideBar
            loggedIn={props.loggedIn}
          />
          {props.children}
        </div>
      </div>
    </div>
  </React.Fragment>
}

export default DashboardContainer;