import React, { Component } from "react";
import TopNav from "../shared/TopNav";
import LeftSideHome from "./LeftCol";
import RightSideHome from "./RightCol";

export default class Home extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <div className="wrapper">
          <TopNav
            loggedIn={this.props.loggedIn}
            handleLogout={this.props.handleLogout}
          />
          <div className="container-fluid container-wrapper">
            <div className="row">
              <LeftSideHome />
              <RightSideHome />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}