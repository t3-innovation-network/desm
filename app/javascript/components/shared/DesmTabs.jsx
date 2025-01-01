import classNames from 'classnames';

/**
 * Props:
 * @param {Array} values A list with objects each with an id and a name
 * @param {Integer} selectedId The is of the selected value
 * @param {Function} onTabClick Callback to execute on any tab click
 */
const DesmTabs = ({ values, selectedId, onTabClick }) => {
  const selectedValue = values.find((value) => value.id === selectedId);

  return (
    <>
      <div className="d-flex gap-3 h4 my-0">
        {values.map((value) => {
          const tabClasses = classNames('badge px-3 py-2 mt-2', {
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
