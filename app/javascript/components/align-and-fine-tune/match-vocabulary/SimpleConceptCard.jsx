import React from "react";
import { Fragment } from "react";
import Collapsible from "../../shared/Collapsible";

/**
 * The concept as a card
 * Props:
 * @param {Object} concept
 * @param {String} origin
 */
const SimpleConceptCard = ({ concept, origin }) => (
  <Collapsible
    expanded
    headerContent={<strong>{concept.name}</strong>}
    cardStyle={"with-shadow mb-2"}
    observeOutside={false}
    bodyContent={
      <Fragment>
        <p>
          {_.isObject(concept.definition) ? concept.definition.en : concept.definition}
        </p>
        <p>
          Origin:
          <span className="col-primary">{" " + origin}</span>
        </p>
      </Fragment>
    }
  />
);

export default SimpleConceptCard;
