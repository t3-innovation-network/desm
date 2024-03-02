import {} from 'react';
import { Link } from 'react-router-dom';
import Stepper from './../mapping/Stepper';

const TopNavOptions = (props) => {
  return (
    <>
      <ul className="navbar-nav mr-auto">
        {props.viewMappings && (
          <li className="nav-item selected-item mt-0 ml-0 ml-lg-3 mr-0 mr-lg-3">
            <Link
              to="/mappings"
              className="nav-link nav-title-highlighted"
              title="See the list of your specifications (and those of your organization)"
            >
              View Mappings
            </Link>
          </li>
        )}
        {props.mapSpecification && (
          <li className="mt-0 ml-0 ml-lg-3 mr-0 mr-lg-3">
            <Link
              to="/new-mapping"
              className="btn wide-btn btn-outline-secondary"
              title="Create a mapping between 2 specifications"
            >
              New Mapping
            </Link>
          </li>
        )}
        {props.stepper && (
          <li>
            <Stepper stepperStep={props.stepperStep} />
          </li>
        )}
      </ul>
      {props.customcontent ? (
        <ul className="navbar-nav mr-auto">
          <li className="mt-0 mb-2 ml-0 ml-lg-3 mr-0 mr-lg-3">{props.customcontent}</li>
        </ul>
      ) : (
        ''
      )}
    </>
  );
};

export default TopNavOptions;
