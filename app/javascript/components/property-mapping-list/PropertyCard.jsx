import { useMemo } from 'react';
import ProgressReportBar from '../shared/ProgressReportBar';
import PropertyComments from './PropertyComments';
import { sortBy } from 'lodash';

/**
 * Props:
 * @param {Object} term
 */
const PropertyCard = ({ term }) => {
  const schemaName = useMemo(() => {
    if (term.schemaName) {
      return term.schemaName;
    }

    const alignments = term.alignments.filter((a) => a.schemaName);
    return sortBy(alignments, 'id')[0]?.schemaName;
  }, [term]);

  return (
    <div className="card borderless bg-col-secondary h-100">
      <div className="card-header desm-rounded bottom-borderless bg-col-secondary">
        <small className="mt-1 col-on-primary-light">Property name</small>
        <h3 className="mb-1">{term.name}</h3>

        <small className="mt-1 col-on-primary-light">Definition</small>
        <div className="mb-1">{<PropertyComments term={term} />}</div>

        <small className="mt-1 col-on-primary-light">Origin</small>
        <p className="mb-1">{schemaName}</p>

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
