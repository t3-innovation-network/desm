import React, { Fragment } from "react";
import { ItemTypes } from "../../mapping-to-domains/ItemTypes";
import Draggable from "../../shared/Draggable";
import ConceptCard from "./ConceptCard";

/**
 * List the concepts for the mapped term vocabulary as selectable cards.
 *
 * Props:
 * @param {String} mappingOrigin
 * @param {Function} filteredMappingConcepts
 * @param {Function} onMappingConceptClick
 */
const MappingConceptsList = (props) => {
  /**
   * Elements from props
   */
  const {
    mappingOrigin,
    filteredMappingConcepts,
    onMappingConceptClick,
  } = props;

  /**
   * Structure for a single concept as a card
   *
   * @param {Object} concept
   */
  const singleConceptCard = (concept) => {
    return (
      <ConceptCard
        concept={concept}
        onClick={onMappingConceptClick}
        origin={mappingOrigin}
      />
    );
  };

  return (
    <Fragment>
      {/* SELECTED CONCEPTS */}
      <Draggable
        items={filteredMappingConcepts({ pickSelected: true })}
        itemType={ItemTypes.CONCEPTS_SET}
      >
        {filteredMappingConcepts({ pickSelected: true }).map((concept) => {
          return (
            <div className="row mb-2" key={concept.id}>
              <div className="col">{singleConceptCard(concept)}</div>
            </div>
          );
        })}
      </Draggable>
      {/* END SELECTED CONCEPTS */}

      {/* NOT SELECTED CONCEPTS */}
      {filteredMappingConcepts({ pickSelected: false }).map((concept) => {
        return (
          <div className="row mb-2" key={concept.id}>
            <div className="col">{singleConceptCard(concept)}</div>
          </div>
        );
      })}
      {/* END NOT SELECTED CONCEPTS */}
    </Fragment>
  );
};
export default MappingConceptsList;
