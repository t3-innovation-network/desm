import React, { useState } from "react";
import SpineTermDropZone from "../mapping-to-domains/SpineTermDropZone";
import ExpandableOptions from "../shared/ExpandableOptions";
import SpineTermCard from "./SpineTermCard";

const SpineTermRow = (props) => {
  /**
   * The spine term passed in props
   */
  const { term, mappingTerm, predicates } = props;

  /**
   * Return the list of predicates as options to use on the abstract
   * expandable options component
   */
  const predicatesAsOptions = () => {
    return props.predicates.map((predicate) => {
      return {
        name: predicate.pref_label,
        id: predicate.id,
      };
    });
  };

  /**
   * Actions to take when a predicate has been selected for a mapping term
   *
   * @param {Object} predicate
   */
  const handlePredicateSelected = (term, predicate) => {
    props.onPredicateSelected(term, predicate);
  };

  return (
    <React.Fragment>
      <div className="row mb-2" key={term.id}>
        <div className="col-5">
          <SpineTermCard
            term={term}
            isMapped={props.isMapped}
            origin={props.origin}
          />
        </div>

        <div className="col-3">
          <ExpandableOptions
            options={predicatesAsOptions()}
            onClose={(predicate) => handlePredicateSelected(term, predicate)}
            selectedOption={
              mappingTerm.predicate_id
                ? predicates.find((p) => p.id === mappingTerm.predicate_id)
                    .pref_label
                : ""
            }
          />
        </div>

        <div className="col-4">
          {props.mappedTermsToSpineTerm(term).length > 0 ? (
            props.mappedTermsToSpineTerm(term).map((mappingTerm) => {
              return (
                <div className="card mb-2" key={mappingTerm.id}>
                  <div className="card-header">
                    {mappingTerm.name}
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
    </React.Fragment>
  );
};

export default SpineTermRow;
