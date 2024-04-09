import ProgressReportBar from '../shared/ProgressReportBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

/**
 * Props:
 * @prop {Object} domain,
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
        <h6 className="subtitle">3. Map CredReg to Schema / Spine</h6>
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
          <div className="custom-control custom-checkbox mb-3">
            <input
              type="checkbox"
              className="custom-control-input desm-custom-control-input cursor-pointer"
              id="hideSpineElms"
              checked={hideMappedSpineTerms}
              onChange={() => setHideMappedSpineTerms(!hideMappedSpineTerms)}
            />
            <label className="custom-control-label cursor-pointer" htmlFor="hideSpineElms">
              Hide Mapped Elements
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
          <div className="form-group input-group-has-icon">
            <FontAwesomeIcon icon={faSearch} className="form-control-feedback" />
            <input
              type="text"
              className="form-control"
              placeholder="Find Element / Property"
              value={spineTermsInputValue}
              onChange={filterSpineTermsOnChange}
            />
          </div>
        </div>
        <div className="col-5" />
        <div className="col-2">
          <button
            className="btn btn-block btn-dark"
            onClick={handleAddSynthetic}
            title="Use this button to add new elements to the spine"
          >
            + Add Synthetic
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpineHeader;
