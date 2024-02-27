import { useDrop } from 'react-dnd';
import Pluralize from 'pluralize';
import { isEmpty } from 'lodash';
import classNames from 'classnames';

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
  const [{ canDrop, isOver, item }, drop] = useDrop({
    accept: acceptedItemType,
    drop: () => droppedItem,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
    }),
  });

  const content = () => {
    const status = isActive ? `Add ${Pluralize('Record', item?.count || selectedCount, true)}` : '';
    const statusCls = classNames('text-center', { 'dnd__status--active': isActive });

    return isEmpty(children) ? (
      <div className="align-items-center d-flex justify-content-center py-5" style={{ flex: 1 }}>
        <span className={statusCls}>{status || placeholder}</span>
      </div>
    ) : (
      <div className="pb-0 pt-2 px-2">
        {status && <p className={statusCls}>{status}</p>}
        {children}
      </div>
    );
  };

  /**
   * Whether there's something being dragged
   */
  const isActive = canDrop && isOver;
  const dropCls = classNames({ 'dnd--active': isActive, 'border-dotted': !isActive });

  return (
    <div className={`card ${dropCls} ${cls}`} ref={drop} style={style}>
      {content()}
    </div>
  );
};

export default DropZone;
