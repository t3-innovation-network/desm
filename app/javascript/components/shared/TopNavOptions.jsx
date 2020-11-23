import React from "react";
import { Link } from "react-router-dom";
import Stepper from "./../mapping/Stepper";

const TopNavOptions = (props) => {
  return (
    <React.Fragment>
      <ul className="navbar-nav mr-auto">
        {props.viewMappings && (
          <li className="nav-item selected-item mt-0 ml-0 ml-lg-3 mr-0 mr-lg-3">
            <Link to="/mappings" className="nav-link nav-title-highlited">
              View Mappings
            </Link>
          </li>
        )}
        {props.mapSpecification && (
          <li className="mt-0 ml-0 ml-lg-3 mr-0 mr-lg-3">
            <Link
              to="/new-mapping"
              className="btn wide-btn btn-outline-secondary"
            >
              Map a Specification
            </Link>
          </li>
        )}
        {props.stepper && (
          <li>
            <Stepper stepperStep={props.stepperStep} />
          </li>
        )}
      </ul>
      <ul className="navbar-nav mr-auto">
        <li className="mt-0 mb-2 ml-0 ml-lg-3 mr-0 mr-lg-3">
          {props.customcontent}
        </li>
      </ul>
    </React.Fragment>
  );
};

export default TopNavOptions;
