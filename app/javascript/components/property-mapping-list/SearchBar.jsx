import React, { Component } from "react";
import ExpandableOptions from "../shared/ExpandableOptions";

/**
 * @description A complete row with a search bar to filter properties
 *
 * Props:
 * @param {Function} onType Actions when a character is typed
 */
export default class SearchBar extends Component {
  /**
   * Values in state
   */
  state = {
    /**
     * The typed characters in the searchbox
     */
    inputValue: "",
  };

  /**
   * Actions when a character is typed in the searchbox
   *
   * @param {Event} event
   */
  handleOnType = (event) => {
    const { onType } = this.props;
    const val = event.target.value;

    this.setState({ inputValue: val }, () => {
      if (onType) {
        onType(val);
      }
    });
  };

  render() {
    /**
     * Elements from state
     */
    const { inputValue } = this.state;

    return (
      <div className="row mt-5">
        <div className="col-3">
          <hr className="bottom-border-white" />
          <div className="form-group has-search">
            <span className="fa fa-search form-control-feedback"></span>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search for an Element / Property"
              value={inputValue}
              onChange={this.handleOnType}
              autoFocus
            />
          </div>
        </div>

        <div className="col-3">
          <label>Sort Spine By</label>
          <ExpandableOptions
            selectedOption={"Name"}
            options={[
              { id: 1, name: "Overall Alignment Score" },
              { id: 2, name: "Name" },
            ]}
            cardHeaderCssClass={"bottom-borderless"}
          />
        </div>

        <div className="col-3">
          <label>Sort Aligned Items By</label>
          <ExpandableOptions
            selectedOption={"Organization"}
            options={[
              { id: 1, name: "Organization" },
              { id: 2, name: "Property" },
            ]}
            cardHeaderCssClass={"bottom-borderless"}
          />{" "}
        </div>

        <div className="col-3">
          <hr className="bottom-border-white" />
          <div className="custom-control custom-checkbox mt-3">
            <input
              type="checkbox"
              className="custom-control-input desm-custom-control-input"
              id="hide-spine-elems"
              value={true}
              onChange={() => {}}
            />
            <label className="custom-control-label" htmlFor="hide-spine-elems">
              Hide spine items with no results
            </label>
          </div>
        </div>
      </div>
    );
  }
}
