import React from "react";
import ProgressReportBar from "../shared/ProgressReportBar";

const SpineHeader = (props) => {
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
              {" " + props.domain}
            </div>
          </div>
        </div>
        <div className="col-5">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="hideSpineElems"
              value={props.hideMappedSpineTerms}
              onChange={(e) =>
                props.setHideMappedSpineTerms(!props.hideMappedSpineTerms)
              }
            />
            <label className="form-check-label" htmlFor="hideSpineElems">
              Hidde Mapped Elements
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
            maxValue={props.mappingTerms.length}
            currentValue={props.mappedMappingTerms.length}
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
              value={props.spineTermsInputValue}
              onChange={props.filterSpineTermsOnChange}
            />
          </div>
        </div>
        <div className="col-5"></div>
        <div className="col-2">
          <button className="btn btn-block btn-dark">+ Add Synthetic</button>
        </div>
      </div>
    </div>
  );
};

export default SpineHeader;
