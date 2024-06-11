import ProgressReportBar from '../shared/ProgressReportBar';
import PropertyComments from './PropertyComments';
import { propertyClassesForSpineTerm } from './stores/propertyMappingListStore';

/**
 * Props:
 * @param {Object} term
 */
const PropertyCard = ({ term }) => {
  const propertyClasses = propertyClassesForSpineTerm(term).map((c) => <li key={c}>{c}</li>);

  return (
    <div className="card borderless bg-col-secondary h-100">
      <div className="card-header desm-rounded bottom-borderless bg-col-secondary">
        <small className="mt-1 col-on-primary-light">Element/Property</small>
        <h3 className="mb-1">{term.name}</h3>

        <small className="mt-1 col-on-primary-light">Class/Type</small>
        <ul className="list-unstyled mb-1">{propertyClasses}</ul>

        <small className="mt-1 col-on-primary-light">Definition</small>
        <div className="mb-1">{<PropertyComments term={term} />}</div>

        <small className="mt-1 col-on-primary-light">Organization</small>
        <p className="mb-1">{term.organization?.name}</p>

        <small className="mt-1 col-on-primary-light">Schema</small>
        <p className="mb-1">{term.alignments.map((a) => a.schemaName).join(', ')}</p>

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
