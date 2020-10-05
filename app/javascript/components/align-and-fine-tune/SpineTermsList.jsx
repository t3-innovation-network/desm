import React from "react";
import SpineTermDropZone from "../mapping-to-domains/SpineTermDropZone";
import SpineTermCard from "./SpineTermCard";

const SpineTermsList = (props) => {
  return (
    <React.Fragment>
      {props.terms.map((term) => {
        return (
          <div className="row mb-2" key={term.id}>
            <div className="col-5">
              <SpineTermCard term={term} />
            </div>

            <div className="col-3">
              <select
                style={{
                  fontSize: "16px",
                  height: "calc(1.5em + 1.8rem + 2px)",
                }}
                name="predicate_id"
                className="custom-select custom-select-lg"
                required
              >
                {props.predicates.map(function (predicate) {
                  return (
                    <option key={predicate.id} value={predicate.id}>
                      {predicate.pref_label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="col-4">
              {props.mappedTermsToSpineTerm(term).length > 0 ? (
                props.mappedTermsToSpineTerm(term).map((mappingTerm) => {
                  return (
                    <div className="card mb-2" key={mappingTerm.id}>
                      <div className="card-header">
                        {mappingTerm.mapped_term.name}
                        <i className="fas fa-check float-right"></i>
                      </div>
                    </div>
                  );
                })
              ) : (
                <SpineTermDropZone
                  term={term}
                  selectedTermsCount={props.selectedMappingTerms.length}
                />
              )}
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default SpineTermsList;
