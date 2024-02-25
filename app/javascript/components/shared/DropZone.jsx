import { useDrop } from 'react-dnd';
import Pluralize from 'pluralize';

/**
 * Props:
 * @param {Object} droppedItem The element that's going to be dropped
 * @param {Integer} selectedCount The number of elements being dragged
 * @param {Style} style CSS styles for the box
 * @param {String} CSS class for the box
 * @param {ItemType} acceptedItemType The type of item that this box accepts
 * @param {String} placeholder The text that is going to appear by default
 */
const DropZone = ({
  acceptedItemType,
  children,
  droppedItem,
  placeholder,
  selectedCount,
  cls,
  style,
}) => {
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

  const content = () => {
    let status = '';

    if (isActive) {
      status = `Add ${Pluralize('Record', selectedCount, true)}`;
    } else if (!children) {
      status = placeholder;
    }

    return status ? (
      <div className="align-items-center d-flex justify-content-center py-5" style={{ flex: 1 }}>
        {status}
      </div>
    ) : (
      <div className="pb-0 pt-2 px-2">{children}</div>
    );
  };

  /**
   * Whether there's something being dragged
   */
  const isActive = canDrop && isOver;

  return (
    <div
      className={`card ${isActive ? 'dnd-active' : 'border-dotted'} ${cls}`}
      ref={drop}
      style={style}
    >
      {content()}
    </div>
  );
};

export default DropZone;
