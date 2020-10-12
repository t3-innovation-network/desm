import React from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

/**
 * This class will hold the list of terms to be displayed in the
 * mapping to domains component.
 * We need it to wrap the terms because it will serve as a representation
 * of tehe selected terms and therefore, will permit to implement
 * the multi drag-n-drop funtionality
 *
 * @param {*} props
 */
const TermCardsContainer = (props) => {
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
      terms: props.terms,
      type: ItemTypes.BOXSET,
    },
    end: (item, monitor) => {
      /**
       * The element where it was dropped in
       */
      const itemDropped = monitor.getDropResult();
      if (item && itemDropped) {
        props.afterDrop(itemDropped);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  /**
   * Only make it draggable when the selected items are more than 1
   */
  return (
    <div
      ref={props.terms.length ? drag : null}
      className={isDragging ? " is-dragging" : ""}
    >
      {props.children}
    </div>
  );
};

export default TermCardsContainer;
