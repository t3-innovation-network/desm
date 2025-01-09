import {} from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useDesktopMediaQuery } from '../../utils/mediaQuery';
import Stepper from './../mapping/Stepper';

const TopNavOptions = (props) => {
  const isDesktop = useDesktopMediaQuery();

  const clsViewMappings = classNames('nav-item', {
    'selected-item mt-0 ms-lg-3 me-lg-3': isDesktop,
  });
  const clsNewMapping = classNames({
    'btn wide-btn btn-outline-secondary': isDesktop,
    'nav-link': !isDesktop,
  });
  return (
    <>
      <ul className="navbar-nav me-auto">
        {props.viewMappings && (
          <li className={clsViewMappings}>
            <Link
              to="/mappings"
              className={`nav-link ${isDesktop ? 'nav-title-highlighted' : ''}`}
              title="See the list of your specifications (and those of your organization)"
            >
              View Mappings
            </Link>
          </li>
        )}
        {props.mapSpecification && (
          <li className="mt-0 ms-0 ms-lg-3 me-0 me-lg-3">
            <Link
              to="/new-mapping"
              className={clsNewMapping}
              title="Create a mapping between 2 specifications"
            >
              New Mapping
            </Link>
          </li>
        )}
        {props.stepper && (
          <li>
            <Stepper stepperStep={props.stepperStep} mapping={props.mapping} />
          </li>
        )}
      </ul>
      {props.customcontent ? (
        <ul className="navbar-nav me-auto">
          <li className="mt-0 mb-2 ms-0 ms-lg-3 me-0 me-lg-3">{props.customcontent}</li>
        </ul>
      ) : (
        ''
      )}
    </>
  );
};

export default TopNavOptions;
