import React, { Component } from "react";
import Nav from "../shared/Navbar";
import LeftSideHome from "./LeftCol";
import RightSideHome from "./RightCol";

export default class Home extends Component{
  render() {
    return (
      <React.Fragment>
        <div className="wrapper">
          <Nav />
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