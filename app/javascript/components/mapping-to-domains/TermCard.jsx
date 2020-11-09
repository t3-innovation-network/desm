import React, { Component } from "react";
import Collapsible from "../shared/Collapsible.jsx";

/**
 * Props:
 * @param {Function} onClick Actions when the user clicks on it
 * @param {Boolean} disableClick Whether we allow to click on this card. If true, it wil trigger onClick
 * @param {Object} term The term object
 * @param {String} origin The name of the organization that created the term specification
 * @param {Boolean} alwaysEnabled Whether after dragged it remains available to drag again
 * @param {Function} isMapped The logic to determine whether this term is or not mapped
 * @param {Boolean} editEnabled Show/Hide the edit option
 * @param {Function} onEditClick The logic to execute when the user click "edit"
 */
export default class TermCard extends Component {
  state = {
    /**
     * Whether the term is selected or not
     */
    selected: this.props.term.selected,
    /**
     * Whether this card should be available to drag after the first successful drop
     */
    alwaysEnabled: this.props.alwaysEnabled,
  };

  /**
   * Make both the term for this component and the one in the mapping,
   * selected or not selected
   */
  handleTermClick = () => {
    const { term, onClick } = this.props;
    const { selected } = this.state;

    // local value (this term)
    this.setState({ selected: !selected }, () => {
      // props value (the term inside the list in the parent component)
      term.selected = !term.selected;
      onClick(term);
    });
  };

  /**
   * After dragging a term card, if it's not meant to be "always enabled" (multiple times draggable),
   * it becomes disabled.
   */
  disabledTermCard = () => {
    const { term } = this.props;

    return (
      <div className="card with-shadow mb-2 disabled-container not-draggable">
        <div className="card-header no-color-header">
          <div className="row">
            <div className="col-8">{term.name}</div>
            <div className="col-4">
              <div className="float-right">
                <i className="fas fa-check"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * The content of the header (The component when it's shrinked)
   */
  termHeaderContent = () => {
    const { term, onEditClick, editEnabled, disableClick } = this.props;
    const { selected } = this.state;

    return (
      <div className="row">
        <div className={"col-8 mb-3" + (disableClick ? "" : (selected ? "" : " cursor-pointer"))}>
          {term.name}
        </div>
        <div className="col-4">
          <div className="float-right">
            {editEnabled && (
              <button
                onClick={() => {
                  onEditClick(term);
                }}
                className="btn"
              >
                <i className="fa fa-pencil-alt"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { selected, alwaysEnabled } = this.state;
    const { term, isMapped, origin, disableClick } = this.props;

    return isMapped(term) && !alwaysEnabled ? (
      this.disabledTermCard()
    ) : (
      <Collapsible
        cardStyle={
          "with-shadow mb-2" + (selected ? " draggable term-selected" : "")
        }
        cardHeaderStyle={"no-color-header pb-0"}
        cardHeaderColStyle={disableClick ? "" : (selected ? "" : "cursor-pointer")}
        handleOnClick={disableClick ? null : this.handleTermClick }
        headerContent={this.termHeaderContent()}
        observeOutside={true}
        bodyContent={
          <div className="card-body pt-0 pb-0">
            <p>{term.property.comment}</p>
            <p>{"Origin: " + origin}</p>
          </div>
        }
      />
    );
  }
}
