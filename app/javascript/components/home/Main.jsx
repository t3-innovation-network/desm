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
      <div className="container">
        <div className="row">
          <LeftSideHome />
          <RightSideHome />
        </div>
      </div>
    </div>
  </React.Fragment>
);
