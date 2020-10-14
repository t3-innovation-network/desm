import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

const SpineTermDropZone = (props) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.BOXSET,
    drop: () => ({
      id: props.term.id,
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
        "card mapping-term-drag-box pt-2 pb-2" +
        (isActive ? " dnd-active" : " border-dotted")
      }
      ref={drop}
    >
      {isActive ? (
        <p className="mb-0 fully-centered">
          {"Add " +
            props.selectedTermsCount +
            " Record" +
            (props.selectedTermsCount > 1 ? "s" : "")}
        </p>
      ) : (
        <p className="mb-0 fully-centered">Drag a matching element here</p>
      )}
    </div>
  );
};

export default SpineTermDropZone;
