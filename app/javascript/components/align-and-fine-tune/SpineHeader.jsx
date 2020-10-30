import React from "react";
import ProgressReportBar from "../shared/ProgressReportBar";

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
              className="custom-control-input desm-custom-control-input"
              id="hideSpineElems"
              value={hideMappedSpineTerms}
              onChange={() => setHideMappedSpineTerms(!hideMappedSpineTerms)}
            />
            <label className="custom-control-label" htmlFor="hideSpineElems">
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
            maxValue={mappingSelectedTerms.length}
            currentValue={mappedSelectedTerms.length}
            messageReport="Mapped"
          />
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-5">
          <div className="form-group has-search">
            <span className="fa fa-search form-control-feedback"></span>
            <input
              type="text"
              className="form-control"
              placeholder="Find Element / Property"
              value={spineTermsInputValue}
              onChange={filterSpineTermsOnChange}
            />
          </div>
        </div>
        <div className="col-5"></div>
        <div className="col-2">
          <button
            className="btn btn-block btn-dark"
            onClick={handleAddSynthetic}
            disabled={props.addingSynthetic}
          >
            + Add Synthetic
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpineHeader;