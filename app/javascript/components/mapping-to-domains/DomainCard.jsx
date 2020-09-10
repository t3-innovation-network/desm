import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

const DomainCard = (props) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: () => ({
      name: props.domain.name,
      uri: props.domain.id,
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOver;

  return (
    <div
      className={
        "card mb-2" + (props.domain.spine ? "" : " disabled-container")
      }
      key={props.domain.id}
    >
      <div className="card-body">
        <div className="row">
          <div className="col-4">
            <h5>
              <strong>{props.domain.name}</strong>
            </h5>
            {props.mappedTerms.length + " Added"}
          </div>
          <div className="col-8">
            {/* Only accept mappingTerms if the domain has a spine */}
            <div
              className={
                "card domain-drag-box pl-5 pr-5 pt-2 pb-2" +
                (isActive ? " dnd-active" : " border-dotted")
              }
              ref={props.domain.spine ? drop : null}
            >
              {isActive ? (
                <p className="mb-0 fully-centered">Add 1 Record</p>
              ) : (
                <p className="mb-0 fully-centered">
                  Drag elements or groups of elements to this domain
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainCard;
