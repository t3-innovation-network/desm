import { first, sortBy } from 'lodash';
import ProgressReportBar from '../shared/ProgressReportBar';

/**
 * Props:
 * @param {Object} term
 */
const PropertyCard = ({ term }) => {
  return (
    <div className="card borderless bg-col-secondary h-100">
      <div className="card-header desm-rounded bottom-borderless bg-col-secondary">
        <small className="mt-1 col-on-primary-light">Element/Property</small>
        <h3 className="mb-1">{term.name}</h3>

        <small className="mt-1 col-on-primary-light">Definition</small>
        <p className="mb-1">{term.property.comment}</p>

        <small className="mt-1 col-on-primary-light">Origin</small>
        <p className="mb-1">{first(sortBy(term.alignments, 'id'))?.schemaName}</p>

        <ProgressReportBar
          currentValue={term.currentMappingWeight}
          maxValue={term.maxMappingWeight}
          percentageMode={true}
          cssClass={'bg-col-success'}
        />
      </div>
    </div>
  );
};

export default PropertyCard;
