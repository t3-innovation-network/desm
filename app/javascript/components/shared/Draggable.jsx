import { useDrag } from 'react-dnd';
import classNames from 'classnames';

/**
 * This class will hold a list of items that can be dragged and the dropped
 * into another component wrapped in a Dropzone component.
 *
 * Props:
 * @param {Array} items It can be 1 or more items, but inside an array to support multiple drag.
 * @param {ItemType} itemType The type of element to be dragged. The Dropzone can be configured
 *    to allow or not this type.
 * @param {Function} afterDrop The actions to perform after dropping the element/s.
 */
const Draggable = (props) => {
  /**
   * Elements from props
   */
  const { items, itemType, afterDrop, children } = props;

  /**
   * Configure the draggable component
   */
  const [{ isDragging }, drag] = useDrag({
    /**
     * The item being dragged.
     * The type will help on recognizing it when dropped.
     * The DropZone element can be configured to accept specific
     * type of elements
     */
    type: itemType,
    item: { count: items.length },
    end: (item, monitor) => {
      /**
       * The element where it was dropped in
       */
      const itemDropped = monitor.getDropResult();
      if (item && itemDropped && afterDrop) {
        afterDrop(itemDropped, items);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  /**
   * Only make it draggable when the selected items are more than 1
   */

  const dragCls = classNames({ 'dnd--dragging': isDragging });
  return (
    <div ref={drag} className={dragCls}>
      {children}
    </div>
  );
};

export default Draggable;
