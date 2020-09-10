import React from 'react';
import { Link } from 'react-router-dom';
import Stepper from './../mapping/Stepper';

const TopNavOptions = (props) => {
  return (
    <ul className="navbar-nav mr-auto">
      {
        props.viewMappings &&
        <li className="nav-item current-page mt-0 mb-1 ml-0 ml-lg-3 mr-0 mr-lg-3">
          <Link to="/specifications" className="nav-link nav-title-highlited">
            View Mappings
          </Link>
        </li>
      }
      {
        props.mapSpecification &&
        <li className="mt-0 mb-1 ml-0 ml-lg-3 mr-0 mr-lg-3">
          <Link to="/new-mapping" className="btn wide-btn btn-outline-secondary">
            Map a Specification
          </Link>
        </li>
      }
      {
        props.stepper &&
        <li>
          <Stepper 
            stepperStep={props.stepperStep}
          />
        </li>
      }
    </ul>
  );
}

export default TopNavOptions;