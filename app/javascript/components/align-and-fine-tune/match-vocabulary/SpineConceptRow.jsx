import React from "react";
import { DraggableItemTypes } from "../../shared/DraggableItemTypes";
import DropZone from "../../shared/DropZone";
import PredicateOptions from "../../shared/PredicateOptions";
import ConceptCard from "./ConceptCard";
import SimpleConceptCard from "./SimpleConceptCard";

/**
 * List the concepts for the spine term vocabulary as cards with the options to map.
 *
 * Props:
 * @param {Object} alignment
 * @param {Object} concept
 * @param {String} mappingOrigin
 * @param {String} spineOrigin
 * @param {Array} predicates
 * @param {Function} onPredicateSelected
 * @param {Integer} selectedCount
 */
const SpineConceptRow = (props) => {
  /**
   * Elements from props
   */
  const {
    alignment,
    concept,
    mappingOrigin,
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

  /**
   * The name of the selected predicate
   */
  const predicateLabel = () => {
    return alignment.predicate_id
      ? predicates.find((p) => p.id == alignment.predicate_id).pref_label
      : null;
  };

  return (
    <div className="row mb-2" key={concept.id}>
      <div className="col-4">
        <SimpleConceptCard concept={concept} origin={spineOrigin} />
      </div>
      <div className="col-4">
        {concept.synthetic ? (
          <SyntheticPredicate />
        ) : (
          <PredicateOptions
            predicates={predicates}
            onPredicateSelected={(predicate) => onPredicateSelected(predicate)}
            predicate={predicateLabel}
          />
        )}
      </div>
      <div className="col-4">
        {alignment.mapped_concepts && alignment.mapped_concepts.length ? (
          alignment.mapped_concepts.map((conc) => {
            return (
              <SimpleConceptCard
                key={conc.id}
                concept={conc}
                origin={mappingOrigin}
              />
            );
          })
        ) : (
          <DropZone
            droppedItem={{ spineConceptId: concept.id }}
            selectedCount={selectedCount}
            acceptedItemType={DraggableItemTypes.CONCEPTS_SET}
            textStyle={{ fontSize: "12px" }}
            placeholder="Drag a matching concept here"
          />
        )}
      </div>
    </div>
  );
};

export default SpineConceptRow;
