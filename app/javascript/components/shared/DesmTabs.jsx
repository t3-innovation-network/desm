import { Component } from 'react';

/**
 * Props:
 * @param {Array} values A list with objects each with an id and a name
 * @param {Integer} selectedId The is of the selected value
 * @param {Function} onTabClick Callback to execute on any tab click
 */
export default class DesmTabs extends Component {
  render() {
    /**
     * Elements from props
     */
    const { values, selectedId, onTabClick } = this.props;

    return (
      <div className="row mt-4">
        {values.map((value) => (
          <span
            className={`badge badge-${selectedId === value.id ? 'primary' : 'secondary'} m-2`}
            key={value.id}
            onClick={() => onTabClick(value.id)}
            style={{ cursor: 'pointer' }}
          >
            {value.name}
          </span>
        ))}
      </div>
    );
  }
}
