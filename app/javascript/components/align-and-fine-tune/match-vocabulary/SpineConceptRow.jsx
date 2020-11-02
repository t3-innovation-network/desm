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
 * @param {Function} onPredicateSelected
 * @param {Integer} selectedCount
 */
const SpineConceptRow = (props) => {
  const {
    concept,
    spineOrigin,
    predicates,
    onPredicateSelected,
    selectedCount,
  } = props;

  /**
   * To show on rows of synthetic concepts
   */
  const SyntheticPredicate = () => {
    return (
      <div className="card">
        <div className="card-header bg-col-primary col-background">
          No Match
        </div>
      </div>
    );
  };

  return (
    <div className="row mb-2" key={concept.id}>
      <div className="col-4">
        <SpineConceptCard concept={concept} spineOrigin={spineOrigin} />
      </div>
      <div className="col-4">
        {concept.synthetic ? (
          <SyntheticPredicate />
        ) : (
          <PredicateOptions
            predicates={predicates}
            onPredicateSelected={(predicate) => onPredicateSelected(predicate)}
          />
        )}
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
