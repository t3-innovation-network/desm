import React, { Component } from "react";

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
      <div className="row mt-5">
        {values.map((value) => {
          return (
            <div className="col" key={value.id}>
              <div className="card borderless desm-tab-item cursor-pointer">
                <div
                  className={
                    "card-header text-center" +
                    (selectedId == value.id
                      ? " selected-item"
                      : " bottom-borderless")
                  }
                  onClick={() => onTabClick(value.id)}
                >
                  <strong className="non-selectable">{value.name}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
