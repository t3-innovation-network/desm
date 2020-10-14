import React from "react";
import ProgressReportBar from "../shared/ProgressReportBar";

const MappingTermsHeaders = (props) => {
  return (
    <div className="border-bottom desm-col-header">
      <div className="row">
        <div className="col-6">
          <p>
            <strong>{props.organizationName + " > "}</strong>
            {props.domain}
          </p>
        </div>
        <div className="col-6">
          <p className="float-right">
            <strong>{props.selectedMappingTerms.length}</strong> elements
            selected
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-8">

          <div className="custom-control custom-checkbox mb-3">
            <input
              type="checkbox"
              className="custom-control-input desm-custom-control-input"
              id="hideMappingElems"
              value={props.hideMappedMappingTerms}
              onChange={(e) =>
                props.setHideMappedMappingTerms(!props.hideMappedMappingTerms)
              }
            />
            <label className="custom-control-label" htmlFor="hideMappingElems">
              Hide Mapped Elements
            </label>
          </div>

        </div>
        <div
          className="col-4"
          style={{
            position: "relative",
            bottom: "1rem",
          }}
        >
          <ProgressReportBar
            maxValue={props.mappingSelectedTerms.length}
            currentValue={props.mappedSelectedTerms.length}
            messageReport="Mapped"
          />
        </div>
      </div>
      <div className="row">
        <div className="col form-group has-search">
          <span className="fa fa-search form-control-feedback"></span>
          <input
            type="text"
            className="form-control"
            placeholder="Find Element / Property"
            value={props.mappingSelectedTermsInputValue}
            onChange={props.filterMappingSelectedTermsOnChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MappingTermsHeaders;
