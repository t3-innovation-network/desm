import React from "react";
import { DraggableItemTypes } from "../../shared/DraggableItemTypes";
import DropZone from "../../shared/DropZone";
import PredicateOptions from "../../shared/PredicateOptions";
import SpineConceptCard from "./SpineConceptCard";

/**
 * List the concepts for the spine term vocabulary as cards with the options to map.
 *
 * Props:
 * @param {Object} concept
 * @param {String} spineOrigin
 * @param {Array} predicates
 * @param {Function} handlePredicateSelected
 * @param {Integer} selectedCount
 */
const SpineConceptRow = (props) => {
  const {
    concept,
    spineOrigin,
    predicates,
    handlePredicateSelected,
    selectedCount,
  } = props;

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
          selectedCount={selectedCount}
          acceptedItemType={DraggableItemTypes.CONCEPTS_SET}
          textStyle={{ fontSize: "12px" }}
        />
      </div>
    </div>
  );
};

export default SpineConceptRow;
