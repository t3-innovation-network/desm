import React from "react";
import { BrowserRouter } from 'react-router-dom'
import Nav from "../shared/Navbar";
import LeftSideHome from "../home/LeftCol";
import RightSideHome from "../home/RightCol";

export default () => (
  <React.Fragment>
    <div className="wrapper">
      <BrowserRouter>
          <Nav />
      </BrowserRouter>
      <div className="container-fluid container-wrapper">
        <div className="row">
          <LeftSideHome />
          <RightSideHome />
        </div>
      </div>
    </div>
  </React.Fragment>
);
