import React from "react";
import { Link } from "react-router-dom";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

const TermCard = (props) => {
  /**
   * Configure the draggable component
   */
  const [{ isDragging }, drag] = useDrag({
    /**
     * The item being dragged.
     * The type will help on recognizing it when dropped. 
     * The "other" element can be configured to accept or not this or other
     * type of elements
     */
    item: {
      name: props.term.name,
      uri: props.term.uri,
      type: ItemTypes.BOX,
    },
    end: (item, monitor) => {
      /**
       * The element where it was dropped in
       */
      const domainDropped = monitor.getDropResult();
      if (item && domainDropped) {
        props.afterDrop(item, domainDropped);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      className={
        "card with-shadow mb-2" +
        (props.term.mappedTo
          ? " disabled-container not-draggable"
          : " draggable") +
        (isDragging ? " is-dragging" : "")
      }
      ref={props.term.mappedTo ? null : drag}
    >
      <div className="card-header no-color-header">
        <div className="row">
          <div className="col-6">{props.term.name}</div>
          <div className="col-6">
            <div className="float-right">
              {props.term.mappedTo ? (
                <i className="fas fa-check"></i>
              ) : (
                <React.Fragment>
                  <button
                    onClick={() => {
                      props.onEditClick(props.term);
                    }}
                    className="btn"
                  >
                    <i className="fa fa-pencil-alt"></i>
                  </button>
                  <Link
                    data-target={"#collapse-term-" + props.term.id}
                    data-toggle="collapse"
                    className="btn"
                    to="#"
                  >
                    <i className="fas fa-angle-down"></i>
                  </Link>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
      <div id={"collapse-term-" + props.term.id} className="collapse card-body">
        {props.term.uri}
      </div>
    </div>
  );
};

export default TermCard;
