import React, { Component } from "react";
import { SlideInDown, FadeIn } from "./Animations.jsx";
import OutsideAlerter from "./OutsideAlerter.jsx";

/**
 * Props:
 * @param {Boolean} expanded
 * @param {String} selectedOption
 * @param {Function} onClose
 * @param {Function} onExpand
 * @param {Array} options
 */
class ExpandableOptions extends Component {
  state = {
    /**
     * Whether the component is expanded or not
     */
    expanded: this.props.expanded || false,
    /**
     * The options currently selected
     */
    selectedOption: this.props.selectedOption,
  };

  /**
   * Shrinks the component without any side effect otr changes.
   * Used for click outside handler. We want this controls to shrink if the user click outside it
   */
  handleShrink = () => {
    this.setState({ expanded: false });
  };

  /**
   * Handle the actions after the user clicks on an option
   * It also executes the callback function 'onClose' passed in props,
   * if any, and passes the selectedOption as an argument.
   *
   * @param {Object} option
   */
  handleOptionClick = (option) => {
    const { onClose } = this.props;
    // Trigger animation
    this.setState({ selectedOption: option.name }, () => {
      // Change visibility
      this.setState({ expanded: false });

      // Execute the callback, if any.
      if (onClose) {
        onClose(option);
      }
    });
  };

  /**
   * Set expanded state, to show all the options
   * It also executes the callback function 'onExpand' passed in props, if any.
   */
  handleExpand = () => {
    const { onExpand } = this.props;
    // Change visibility
    this.setState({ expanded: true }, () => {
      // Execute the callback, if any.
      if (onExpand) {
        onExpand();
      }
    });
  };

  render() {
    const { expanded, selectedOption } = this.state;
    const { options } = this.props;

    return (
      <OutsideAlerter onOutsideAlert={() => this.handleShrink()}>
        {expanded ? (
          <SlideInDown className="float-over">
            <div className="card with-shadow">
              {this.props.options.map((option) => {
                return (
                  <div
                    key={option.id}
                    className="p-2 cursor-pointer hover-col-primary border-bottom"
                    onClick={() => this.handleOptionClick(option)}
                  >
                    {option.name}
                  </div>
                );
              })}
            </div>
          </SlideInDown>
        ) : (
          <FadeIn>
            <div className="card with-shadow">
              <div
                className={
                  "card-header cursor-pointer" +
                  (selectedOption ? " pb-0" : " pb-4")
                }
                onClick={this.handleExpand}
              >
                <p>
                  <strong>{selectedOption}</strong>
                  <i className="fas fa-angle-down float-right"></i>
                </p>
              </div>
            </div>
          </FadeIn>
        )}
      </OutsideAlerter>
    );
  }
}

export default ExpandableOptions;
