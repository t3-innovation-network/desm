import React from "react";
import TopNav from "../shared/TopNav";
import MappingForm from "./MappingForm";
import MappingPreview from "./MappingPreview";

const Mapping = (props) => {

  const handleRedirect = (path) => {
    props.history.push(path);
  }

  return (
    <React.Fragment>
      <div className="wrapper">
        <TopNav />
        <div className="container-fluid container-wrapper">
          <div className="row">
            <MappingForm />
            <MappingPreview redirect={handleRedirect}/>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Mapping;
