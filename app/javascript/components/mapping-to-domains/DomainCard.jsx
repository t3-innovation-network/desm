import React from "react";
import { DraggableItemTypes } from "../shared/DraggableItemTypes";
import DropZone from "../shared/DropZone";
import TermCard from "./TermCard";

const DomainCard = ({ domain, mappedTerms, selectedTermsCount }) => (
  <div className="card mb-2" key={domain.id}>
    <div className="card-body">
      <div className="row">
        <div className="col-4">
          <h5>
            <strong>{domain.pref_label}</strong>
          </h5>
          {mappedTerms.length + " Added"}
        </div>
        <div className="col-8">
          {/* Only accept alignments if the domain has a spine */}
          <DropZone
            droppedItem={{ name: domain.name, uri: domain.id }}
            acceptedItemType={DraggableItemTypes.PROPERTIES_SET}
            selectedCount={selectedTermsCount}
            placeholder="Drag a matching property here"
            style={{ minHeight: "200px" }}
          >
            {mappedTerms.length > 0 && (
              mappedTerms.map(term => (
                <TermCard
                  disableClick
                  expanded={false}
                  isMapped={() => false}
                  key={term.id}
                  term={term}
                />
              ))
            )}
          </DropZone>
        </div>
      </div>
    </div>
  </div>
);

export default DomainCard;
