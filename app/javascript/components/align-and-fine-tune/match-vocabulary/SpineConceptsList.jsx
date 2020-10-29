import React from "react";
import { ItemTypes } from "../../mapping-to-domains/ItemTypes";
import DropZone from "../../shared/DropZone";
import PredicateOptions from "../../shared/PredicateOptions";
import SpineConceptCard from "./SpineConceptCard";

/**
 * List the concepts for the spine term vocabulary as cards with the options to map.
 * 
 * Props:
 * @param {Array} spineConcepts
 * @param {String} spineOrigin
 * @param {Array} predicates
 * @param {Function} handlePredicateSelected
 * @param {Function} filteredMappingConcepts
 */
const SpineConceptsList = (props) => {
  const {
    spineConcepts,
    spineOrigin,
    predicates,
    handlePredicateSelected,
    filteredMappingConcepts,
  } = props;

  return spineConcepts.map((concept) => {
    return (
      <div className="row mb-2" key={concept.id}>
        <div className="col-4">
          <SpineConceptCard concept={concept} spineOrigin={spineOrigin} />
        </div>
        <div className="col-4">
          <PredicateOptions
            predicates={predicates}
            onPredicateSelected={(concept) => handlePredicateSelected(concept)}
          />
        </div>
        <div className="col-4">
          <DropZone
            droppedItem={{ id: concept.id }}
            selectedCount={
              filteredMappingConcepts({ pickSelected: true }).length
            }
            acceptedItemType={ItemTypes.CONCEPTS_SET}
            textStyle={{ fontSize: "12px" }}
          />
        </div>
      </div>
    );
  });
};

export default SpineConceptsList;