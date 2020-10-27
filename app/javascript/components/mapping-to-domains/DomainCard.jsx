import React from "react";
import DropZone from "../shared/DropZone";

const DomainCard = (props) => {
  return (
    <div
      className={
        "card mb-2" + (props.domain.spine_id ? "" : " disabled-container")
      }
      key={props.domain.id}
    >
      <div className="card-body">
        <div className="row">
          <div className="col-4">
            <h5>
              <strong>{props.domain.pref_label}</strong>
            </h5>
            {props.mappedTerms.length + " Added"}
          </div>
          <div className="col-8">
            {/* Only accept mappingTerms if the domain has a spine */}
            <DropZone
              draggable={{
                name: props.domain.name,
                uri: props.domain.id,
              }}
              selectedCount={props.selectedTermsCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainCard;
