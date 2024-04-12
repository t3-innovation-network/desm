import ProgressReportBar from '../shared/ProgressReportBar';
import { propertyClassesForSpineTerm } from './stores/propertiesListStore';

/**
 * Props:
 * @param {Object} term
 */
const PropertyCard = ({ term }) => {
  const propertyClasses = propertyClassesForSpineTerm(term).map((c) => <li key={c}>{c}</li>);
  return (
    <div className="card borderless bg-col-secondary h-100">
      <div className="card-header desm-rounded bottom-borderless bg-col-secondary">
        <small className="mt-3 col-on-primary-light">Element/Property</small>
        <h3>{term.name}</h3>

        <small className="mt-3 col-on-primary-light">Class/Type</small>
        <ul className="list-unstyled">{propertyClasses}</ul>

        <small className="mt-3 col-on-primary-light">Definition</small>
        <p>{term.property.comment}</p>

        <small className="mt-3 col-on-primary-light">Organization</small>
        <p>{term.organization?.name}</p>

        <small className="mt-3 col-on-primary-light">Schema</small>
        <p>{term.alignments.map((a) => a.schemaName).join(', ')}</p>

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
