import { useRef, useState, useEffect } from 'react';
import classNames from 'classnames';

/**
 * Props:
 * @param {Array} values A list with objects each with an id and a name
 * @param {Integer} selectedId The is of the selected value
 * @param {Function} onTabClick Callback to execute on any tab click
 */
const DesmTabs = ({ values, selectedId, onTabClick }) => {
  const selectedValue = values.find((value) => value.id === selectedId);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouchDevice();
    updateScrollButtons();
  }, [values]);

  const handleMouseDown = (e) => {
    const container = scrollContainerRef.current;
    container.isDown = true;
    container.startX = e.pageX - container.offsetLeft;
  };

  const handleMouseLeave = () => {
    const container = scrollContainerRef.current;
    container.isDown = false;
  };

  const handleMouseUp = () => {
    const container = scrollContainerRef.current;
    container.isDown = false;
  };

  const handleMouseMove = (e) => {
    const container = scrollContainerRef.current;
    if (!container.isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - container.startX) * 3; // Scroll-fast
    container.scrollLeft = container.scrollLeft - walk;
    updateScrollButtons();
  };

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    container.scrollLeft -= 100; // Adjust the value as needed
    updateScrollButtons();
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    container.scrollLeft += 100; // Adjust the value as needed
    updateScrollButtons();
  };

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
  };

  return (
    <>
      {!isTouchDevice && (canScrollRight || canScrollLeft) ? (
        <div className="d-flex gap-2 justify-content-end mb-2">
          <button
            className="desm-tabs__arrow btn btn-light p-0 rounded-circle border-dark-subtle"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <span className="desm-icon fs-5">chevron_left</span>
          </button>
          <button
            className="desm-tabs__arrow btn btn-light p-0 rounded-circle border-dark-subtle"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <span className="desm-icon fs-5">chevron_right</span>
          </button>
        </div>
      ) : null}
      <div
        className="desm-tabs__scroll-container d-flex gap-3 h4 my-0"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {values.map((value) => {
          const tabClasses = classNames('badge px-3 py-2', {
            'bg-primary': selectedId === value.id,
            'bg-secondary': selectedId !== value.id,
          });
          return (
            <span
              className={tabClasses}
              key={value.id}
              onClick={() => onTabClick(value.id)}
              style={{ cursor: 'pointer' }}
              title={value.definition}
            >
              {value.name}
            </span>
          );
        })}
      </div>
      {selectedValue?.definition && (
        <div className="w-100">
          <small>{selectedValue.definition}</small>
        </div>
      )}
    </>
  );
};

export default DesmTabs;
