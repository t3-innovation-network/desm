import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { useSelector } from "react-redux";
import { Animated } from "react-animated-css";

const TermCard = (props) => {
  /**
   * The logged in user
   */
  const user = useSelector((state) => state.user);

  /**
   * The representation of the term for this component
   */
  const [selected, setSelected] = useState(false);

  /**
   * Whether we're showing or not the tooltip for multiselect
   */
  const [showingTooltip, setShowingTooltip] = useState(false);

  /**
   * The message to show on the tooltip
   */
  const toolTipMessage = "Use [Ctrl + Click] for multiselect";

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

  /**
   * Make both the term for this component and the one in the mapping,
   * selected
   */
  const handleTermClick = (event) => {
    if (event.ctrlKey) {
      setSelected(!selected);
      props.onClick();
    } else {
      setShowingTooltip(true);
      setTimeout(() => {
        setShowingTooltip(false);
      }, 3000);
    }
  };

  return (
    <div
      className={
        "card with-shadow mb-2" +
        (props.term.mappedTo
          ? " disabled-container not-draggable"
          : " draggable") +
        (selected ? " term-selected" : "") +
        (isDragging ? " is-dragging" : "")
      }
      ref={props.term.mappedTo ? null : drag}
    >
      <div className="card-header no-color-header pb-0">
        <div className="row">
          <div className="col-6" onClick={handleTermClick}>
            {props.term.name}
            <Animated
              animationIn="fadeIn"
              animationOut="fadeOut"
              isVisible={showingTooltip}
              className="desm-tooltip"
            >
              {toolTipMessage}
            </Animated>
          </div>
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
      <div
        id={"collapse-term-" + props.term.id}
        className="collapse card-body pt-0 pb-0"
      >
        <p>{props.term.property.comment}</p>
        <p>{"Origin: " + user.organization.name}</p>
      </div>
    </div>
  );
};

export default TermCard;
