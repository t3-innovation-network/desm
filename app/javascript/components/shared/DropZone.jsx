import React from "react";
import { useDrop } from "react-dnd";
import Pluralize from "pluralize";

/**
 * Props:
 * @param {Object} droppedItem The element that's going to be dropped
 * @param {Integer} selectedCount The number of elements being dragged
 * @param {Style} textStyle CSS styles for the text inside
 * @param {ItemType} acceptedItemType The type of item that this box accepts
 */
const DropZone = (props) => {
  /**
   * Elements from props
   */
  const { droppedItem, selectedCount, textStyle, acceptedItemType } = props;

  /**
   * Draggable configuration
   */
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: acceptedItemType,
    drop: () => droppedItem,
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
