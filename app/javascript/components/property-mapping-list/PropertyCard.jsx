import { useMemo } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import classNames from 'classnames';
import ProgressReportBar from '../shared/ProgressReportBar';
import PropertyComments from './PropertyComments';
import { sortBy } from 'lodash';

/**
 * Props:
 * @param {Object} term
 * @param {Boolean} collapsed
 * @param {Boolean} showingConnectors
 * @param {Function} onToggleTermCollapse
 */
const PropertyCard = ({ term, collapsed, showingConnectors, onToggleTermCollapse }) => {
  const clsToggle = classNames('desm-icon me-1 desm-toggle fs-3', {
    'desm-toggle--collapsed': collapsed,
  });
  const clsConnector = classNames('desm-connector--mapping d-lg-none', {
    'd-none': !showingConnectors,
  });
  const clsHeaderVerticalConnector = classNames(
    'desm-connector--mapping-header-vertical d-lg-none',
    {
      'd-none': !showingConnectors,
    }
  );
  const clsVerticalConnector = classNames('desm-connector--mapping-vertical d-lg-none', {
    'd-none': !showingConnectors,
  });

  return (
    <div className="desm-mapping-list__card card h-100 rounded-0 bg-bg-dark">
      <div
        className="card-header bg-bg-dark px-0 py-2 p-lg-2 d-flex justify-content-between align-items-center cursor-pointer"
        onClick={() => onToggleTermCollapse(term.id)}
        aria-controls={`property-${term.id}`}
        aria-expanded={!collapsed}
      >
        <div>
          <small>Property name</small>
          <h3 className="fs-5 fw-bold position-relative">
            {term.name}
            <div className={clsConnector}></div>
            <div className={clsHeaderVerticalConnector}></div>
          </h3>
        </div>
        <div className={clsToggle}>keyboard_arrow_up</div>
      </div>
      <Collapse in={!collapsed}>
        <div className="card-body px-0 py-2 p-lg-2 position-relative" id={`property-${term.id}`}>
          <div className={clsVerticalConnector}></div>
          <small className="mt-1">Definition</small>
          <div className="mb-1">{<PropertyComments term={term} />}</div>
          <ProgressReportBar
            currentValue={term.currentMappingWeight}
            maxValue={term.maxMappingWeight}
            percentageMode={true}
            cssClass={'bg-col-success'}
          />
        </div>
      </Collapse>
    </div>
  );
};

export default PropertyCard;
