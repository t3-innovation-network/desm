import ProgressReportBar from '../shared/ProgressReportBar';
import Pluralize from 'pluralize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

/**
 * Props
 * @prop {String} organizationName
 * @prop {Object} domain
 * @prop {Array} selectedAlignments
 * @prop {Boolean} hideMappedSelectedTerms
 * @prop {Function} setHideMappedSelectedTerms
 * @prop {Array} mappingSelectedTerms
 * @prop {Array} mappedSelectedTerms
 * @prop {String} mappingSelectedTermsInputValue
 * @prop {Function} filterMappingSelectedTermsOnChange
 */
const AlignmentsHeader = (props) => {
  const {
    organizationName,
    domain,
    selectedAlignments,
    hideMappedSelectedTerms,
    mappedSelectedTerms,
    mappingSelectedTerms,
    mappingSelectedTermsInputValue,
    filterMappingSelectedTermsOnChange,
    setHideMappedSelectedTerms,
    clearTermsSelection,
  } = props;

  return (
    <div className="border-bottom desm-col-header">
      <div className="row">
        <div className="col-8">
          <p>
            <strong>{organizationName + ' > '}</strong>
            {domain}
          </p>
        </div>
        <div
          className="col-4"
          style={{
            position: 'relative',
            bottom: '1rem',
          }}
        >
          <ProgressReportBar
            maxValue={mappingSelectedTerms.length}
            currentValue={mappedSelectedTerms.length}
            messageReport="Mapped"
            cssClass="bg-col-on-primary"
          />
        </div>
      </div>
      <div className="row">
        <div className="col form-group input-group-has-icon position-relative">
          <FontAwesomeIcon icon={faSearch} className="form-control-feedback" />
          <input
            type="text"
            className="form-control"
            placeholder="Find Element / Property"
            value={mappingSelectedTermsInputValue}
            onChange={filterMappingSelectedTermsOnChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <strong>{selectedAlignments.length}</strong>{' '}
          {Pluralize('property', selectedAlignments.length) + ' selected'}
          {selectedAlignments.length ? (
            <button className="btn btn-link py-0" onClick={clearTermsSelection}>
              {selectedAlignments.length ? 'Deselect' : 'Select'} All
            </button>
          ) : null}
        </div>
        <div className="col-6">
          <div className="form-check float-end">
            <input
              className="form-check-input"
              type="checkbox"
              value={hideMappedSelectedTerms}
              onChange={(_e) => setHideMappedSelectedTerms(!hideMappedSelectedTerms)}
              id="hideMappingElems"
            />
            <label className="form-check-label" htmlFor="hideMappingElems">
              Hide mapped properties
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlignmentsHeader;
