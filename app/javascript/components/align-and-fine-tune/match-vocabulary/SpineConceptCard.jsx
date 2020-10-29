import React from "react";
import { Fragment } from "react";
import Collapsible from "../../shared/Collapsible";

/**
 * The concept as a card
 * Props:
 * @param {Object} concept
 */
const SpineConceptCard = (props) => {
  const { concept, spineOrigin } = props;

  return (
    <Collapsible
      headerContent={<strong>{concept.name}</strong>}
      cardStyle={"with-shadow mb-2"}
      observeOutside={false}
      bodyContent={
        <Fragment>
          <p>{concept.definition}</p>
          <p>
            Origin:
            <span className="col-primary">{" " + spineOrigin}</span>
          </p>
        </Fragment>
      }
    />
  );
};

export default SpineConceptCard;
