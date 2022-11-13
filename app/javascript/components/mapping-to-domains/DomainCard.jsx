import React from "react";
import { DraggableItemTypes } from "../shared/DraggableItemTypes";
import DropZone from "../shared/DropZone";

const DomainCard = (props) => (
  <div className="card mb-2" key={props.domain.id}>
    <div className="card-body">
      <div className="row">
        <div className="col-4">
          <h5>
            <strong>{props.domain.pref_label}</strong>
          </h5>
          {props.mappedTerms.length + " Added"}
        </div>
        <div className="col-8">
          {/* Only accept alignments if the domain has a spine */}
          <DropZone
            droppedItem={{
              name: props.domain.name,
              uri: props.domain.id,
            }}
            acceptedItemType={DraggableItemTypes.PROPERTIES_SET}
            selectedCount={props.selectedTermsCount}
            placeholder="Drag a matching property here"
            style={{ height: "200px" }}
          />
        </div>
      </div>
    </div>
  </div>
);

export default DomainCard;
