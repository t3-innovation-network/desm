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
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value={props.hideMappedMappingTerms}
              onChange={(e) =>
                props.setHideMappedMappingTerms(!props.hideMappedMappingTerms)
              }
              id="hideElems"
            />
            <label className="form-check-label" htmlFor="hideElems">
              Hidde Mapped Elements
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
            maxValue={props.mappingTerms.length}
            currentValue={props.mappedMappingTerms.length}
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
            value={props.mappingTermsInputValue}
            onChange={props.filterMappingTermsOnChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MappingTermsHeaders;
