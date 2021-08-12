import React, { useState } from "react";
import TopNav from "../shared/TopNav";
import MappingForm from "./MappingForm";
import MappingPreview from "./MappingPreview";
import TopNavOptions from "../shared/TopNavOptions";
import AlertNotice from "../shared/AlertNotice";
import { useSelector } from "react-redux";

const Mapping = (props) => {
  /**
   * The errors in the mapping form accross different components
   */
  const mappingFormErrors = useSelector((state) => state.mappingFormErrors);

  /**
   * Here is where the route redirects when the user wants to map
   * a specification, so here is where we can handle redirections.
   */
  const handleRedirect = (path) => {
    props.history.push(path);
  };

  /**
   * Configure the options to see at the center of the top navigation bar
   */
  const navCenterOptions = () => {
    return (
      <TopNavOptions
        viewMappings={true}
        mapSpecification={true}
        stepper={true}
        stepperStep={1}
      />
    );
  };

  return (
    <React.Fragment>
      <div className="wrapper">
        <TopNav centerContent={navCenterOptions} />
        <div className="container-fluid container-wrapper">
          {mappingFormErrors.length ? (
            <AlertNotice message={mappingFormErrors} />
          ) : (
            ""
          )}
          <div className="row">
            <MappingForm />
            <MappingPreview redirect={handleRedirect} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Mapping;
