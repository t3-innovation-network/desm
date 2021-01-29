import React from "react";
import ProgressReportBar from "../shared/ProgressReportBar";
import {Link} from "react-router-dom";

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
 * @prop {Array} mappingTerms
 */
const SpineHeader = (props) => {
  const {
    domain,
    hideMappedSpineTerms,
    setHideMappedSpineTerms,
    mappingSelectedTerms,
    mappedSelectedTerms,
    spineTermsInputValue,
    filterSpineTermsOnChange,
    handleAddSynthetic,
    mappingTerms,
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
              {" " + domain}
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
            position: "relative",
            bottom: "1rem",
          }}
        >
          <ProgressReportBar
            maxValue={mappingTerms.length}
            currentValue={
              mappingTerms.filter((mTerm) => mTerm.mapped_terms.length).length
            }
            messageReport="Mapped"
            cssClass="bg-col-on-primary"
          />
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-5">
          <div className="form-group input-group-has-icon">
            <span className="fa fa-search form-control-feedback"/>
            <input
              type="text"
              className="form-control"
              placeholder="Find Element / Property"
              value={spineTermsInputValue}
              onChange={filterSpineTermsOnChange}
            />
          </div>
        </div>
        <div className="col-5"/>
        <div className="col-2">
          <button
            className="btn btn-block btn-dark"
            onClick={handleAddSynthetic}
            disabled={props.addingSynthetic}
            data-toggle="tooltip"
            data-placement="top"
            title="Add a synthetic property to the spine. This new property will be available to map for this and further mappings"
          >
            + Add Synthetic
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpineHeader;
