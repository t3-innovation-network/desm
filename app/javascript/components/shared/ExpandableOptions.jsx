import React, { Component } from "react";
import { Animated } from "react-animated-css";

class ExpandableOptions extends Component {
  state = {
    /**
     * Whether the component is expanded or not
     */
    expanded: this.props.expanded || false,
    /**
     * The status of the component's animation when it's shrinked
     */
    shrinkedAnimationisVisible: true,
    /**
     * The status of the option's wrapper animation
     */
    expandedAnimationisVisible: false,
    /**
     * The card animation duration in miliseconds
     */
    shrinkedAnimationDuration: 250,
    /**
     * The term body animation duration in miliseconds
     */
    expandedAnimationDuration: 500,
    /**
     * The options currently selected
     */
    selectedOption: this.props.selectedOption,
  };

  /**
   * Handle the actions after the user clicks on an option
   * It also executes the callback function 'onClose' passed in props,
   * if any, and passes the selectedOption as an argument.
   *
   * @param {Object} option
   */
  handleOptionClick = (option) => {
    const { expandedAnimationDuration } = this.state;
    // Trigger animation
    this.setState(
      { expandedAnimationisVisible: false, selectedOption: option.name },
      () => {
        // Await until the animation finishes. Otherwise the element just roughly dissapears
        setTimeout(() => {
          this.setState({ shrinkedAnimationisVisible: true });

          // Change visibility
          this.setState({ expanded: false });
        }, expandedAnimationDuration);
      }
    );

    if (this.props.onClose) {
      this.props.onClose(option);
    }
  };

  /**
   * Set expanded state, to show all the options
   * It also executes the callback function 'onExpand' passed in props, if any.
   */
  handleExpand = () => {
    const { shrinkedAnimationDuration } = this.state;

    // Trigger animation
    this.setState({ expandedAnimationisVisible: true }, () => {
      // Await until the animation finishes. Otherwise the element just roughly dissapears
      setTimeout(() => {
        this.setState({ shrinkedAnimationisVisible: false });

        // Change visibility
        this.setState({ expanded: true });
      }, shrinkedAnimationDuration);
    });

    if (this.props.onExpand) {
      this.props.onExpand();
    }
  };

  render() {
    const {
      expanded,
      expandedAnimationDuration,
      expandedAnimationisVisible,
      shrinkedAnimationDuration,
      shrinkedAnimationisVisible,
      selectedOption,
    } = this.state;
    return (
      <React.Fragment>
        {expanded ? (
          <Animated
            animationIn="slideInDown"
            animationOut="slideOutUp"
            animationInDuration={expandedAnimationDuration}
            animationOutDuration={expandedAnimationDuration}
            isVisible={expandedAnimationisVisible}
            className="float-over"
          >
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
          </Animated>
        ) : (
          <Animated
            animationIn="fadeIn"
            animationOut="slideOutUp"
            animationInDuration={shrinkedAnimationDuration}
            animationOutDuration={shrinkedAnimationDuration}
            isVisible={shrinkedAnimationisVisible}
          >
            <div className="card with-shadow">
              <div
                className={"card-header" + (selectedOption ? " pb-0" : " pb-4")}
                onClick={() => this.handleExpand()}
              >
                <p>
                  <strong>{selectedOption}</strong>
                  <span className="cursor-pointer">
                    <i className="fas fa-angle-down float-right"></i>
                  </span>
                </p>
              </div>
            </div>
          </Animated>
        )}
      </React.Fragment>
    );
  }
}

export default ExpandableOptions;
