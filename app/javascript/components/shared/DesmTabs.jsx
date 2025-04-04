import { useRef, useState, useEffect } from 'react';
import classNames from 'classnames';

/**
 * Props:
 * @param {Array} values A list with objects each with an id and a name
 * @param {Integer} selectedId The is of the selected value
 * @param {Function} onTabClick Callback to execute on any tab click
 */
const DesmTabs = ({
  values,
  selectedId,
  onTabClick,
  isAllTermsCollapsed,
  isAllTermsExpanded,
  collapseAllTerms,
  expandAllTerms,
}) => {
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
            title="Scroll Left"
          >
            <span className="desm-icon fs-5">chevron_left</span>
          </button>
          <button
            className="desm-tabs__arrow btn btn-light p-0 rounded-circle border-dark-subtle"
            onClick={scrollRight}
            disabled={!canScrollRight}
            title="Scroll Right"
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
        tabIndex="0" // Make the element focusable
        role="tablist" // Add appropriate ARIA role
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
              tabIndex="0" // Make each tab focusable
              role="tab" // Add ARIA role for tabs
              aria-selected={selectedId === value.id} // Indicate selected tab
            >
              {selectedId === value.id ? (
                <h1 className="u-txt--badge my-0">{value.name}</h1>
              ) : (
                value.name
              )}
            </span>
          );
        })}
      </div>
      {selectedValue?.definition && (
        <div className="w-100 d-flex gap-3 mt-2">
          <small>{selectedValue.definition}</small>
        </div>
      )}
      <div
        className={`w-100 d-flex gap-2 ${selectedValue?.definition ? 'mt-1' : 'mt-3'} align-items-center`}
      >
        <button
          className="btn btn-link p-0"
          onClick={collapseAllTerms}
          disabled={isAllTermsCollapsed}
          title="Collapse All"
        >
          Collapse All
        </button>
        {' / '}
        <button
          className="btn btn-link p-0"
          onClick={expandAllTerms}
          disabled={isAllTermsExpanded}
          title="Expand All"
        >
          Expand All
        </button>
      </div>
    </>
  );
};

export default DesmTabs;
