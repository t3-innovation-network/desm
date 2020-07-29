import React from "react";
import { BrowserRouter } from 'react-router-dom'
import Nav from "../shared/Navbar";
import LeftSideForm from "../mapping/LeftSideForm";

export default () => (
  <React.Fragment>
    <div className="wrapper">
      <BrowserRouter>
          <Nav />
      </BrowserRouter>
      <div className="container-fluid container-wrapper">
        <div className="row">
          <LeftSideForm />
          <div className="col-lg-6 p-lg-5 pt-5 bg-col-secondary">
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
);
