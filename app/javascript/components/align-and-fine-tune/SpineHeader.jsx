import ProgressReportBar from '../shared/ProgressReportBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

/**
 * Props:
 * @prop {Object} domain,
 * @prop {String} specificationName,
 * @prop {Boolean} hideMappedSpineTerms,
 * @prop {Function} setHideMappedSpineTerms,
 * @prop {Array} mappingSelectedTerms,
 * @prop {Array} mappedSelectedTerms,
 * @prop {String} spineTermsInputValue,
 * @prop {Function} filterSpineTermsOnChange,
 * @prop {Function} handleAddSynthetic,
 * @prop {Array} alignments
 */
const SpineHeader = (props) => {
  const {
    domain,
    specificationName,
    hideMappedSpineTerms,
    setHideMappedSpineTerms,
    spineTermsInputValue,
    filterSpineTermsOnChange,
    handleAddSynthetic,
    alignments,
    noMatchPredicateId,
  } = props;

  return (
    <div className="border-bottom desm-col-header">
      <div className="row mb-2">
        <h6 className="subtitle">3. Map {specificationName} to Schema / Spine</h6>
      </div>
      <div className="row mb-2">
        <div className="col-5">
          <div className="card">
            <div className="card-header">
              <strong>Map to:</strong>
              {' ' + domain}
            </div>
          </div>
        </div>
        <div className="col-5">
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input cursor-pointer"
              id="hideSpineElms"
              checked={hideMappedSpineTerms}
              onChange={() => setHideMappedSpineTerms(!hideMappedSpineTerms)}
            />
            <label className="form-check-label cursor-pointer" htmlFor="hideSpineElms">
              Hide mapped properties/elements
            </label>
          </div>
        </div>
        <div
          className="col-2"
          style={{
            position: 'relative',
            bottom: '1rem',
          }}
        >
          <ProgressReportBar
            maxValue={alignments.length}
            currentValue={
              alignments.filter(
                (alignment) =>
                  alignment.predicateId &&
                  (alignment.predicateId === noMatchPredicateId || alignment.mappedTerms.length)
              ).length
            }
            messageReport="Mapped"
            cssClass="bg-col-on-primary"
          />
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-5">
          <div className="form-group input-group-has-icon position-relative">
            <FontAwesomeIcon icon={faSearch} className="form-control-feedback" />
            <input
              type="text"
              className="form-control"
              placeholder="Find Property/Element"
              value={spineTermsInputValue}
              onChange={filterSpineTermsOnChange}
            />
          </div>
        </div>
        <div className="col-5" />
        <div className="col-2">
          <button
            className="btn w-100 btn-dark"
            onClick={handleAddSynthetic}
            title="Use this button to add new properties/elements to the spine"
          >
            + Add Spine Term
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpineHeader;
