import React from "react";
import TopNav from "../shared/TopNav";
import LeftSideForm from "./LeftSideForm";

const Mapping = () => {
  return (
    <React.Fragment>
      <div className="wrapper">
        <TopNav/>
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
}

export default Mapping;