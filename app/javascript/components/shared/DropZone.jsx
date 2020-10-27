import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../mapping-to-domains/ItemTypes";
import Pluralize from "pluralize";

/**
 * Props:
 * @param {Object} draggable The element that's going to be dragged
 * @param {Integer} selectedCount The number of elements being dragged
 */
const DropZone = (props) => {
  /**
   * Elements from props
   */
  const { draggable, selectedCount, textStyle } = props;

  /**
   * Draggable configuration
   */
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.BOXSET,
    drop: () => draggable,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  /**
   * Whether there's something being dragged
   */
  const isActive = canDrop && isOver;

  return (
    <div
      className={
        "card mapping-term-drag-box pt-2 pb-2" +
        (isActive ? " dnd-active" : " border-dotted")
      }
      ref={drop}
    >
      <p className="mb-0 fully-centered" style={textStyle}>
        {isActive
          ? "Add " + (selectedCount + " " + Pluralize("Record", selectedCount))
          : "Drag a matching element here"}
      </p>
    </div>
  );
};

export default DropZone;
