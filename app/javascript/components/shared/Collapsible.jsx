import React, { Component } from "react";
import { FadeIn } from "./Animations.jsx";
import OutsideAlerter from "./OutsideAlerter.jsx";

/**
 * Props:
 * @param {Object} mTerm
 * @param {Function} handleOnClick
 * @param {String} cardStyle,
 * @param {String} cardHeaderStyle,
 * @param {String} cardHeaderColStyle,
 * @param {String} bodyStyle,
 * @param {React.Component} bodyContent,
 * @param {React.Component} headerContent,
 * @param {Boolean} observeOutside Whether this component should react or not on an oustise event
 */
export default class Collapsible extends Component {
  state = {
    /**
     * Whether the term body is visible or not
     */
    showBody: false,
  };

  /**
   * Make both the term for this component and the one in the mapping.
   */
  handleClick = () => {
    const { handleOnClick } = this.props;

    if (handleOnClick) {
      handleOnClick();
    }
  };

  /**
   * Manages to show/hide the term body depending on the current state.
   * Triggered when a user clicks outside this component (just shrink it).
   */
  hideBody = () => {
    this.setState({ showBody: false });
  };

  /**
   * Manages to show/hide the body of this component depending on the current state.
   * Triggered when a user clicks on the control to expand/shrink it.
   */
  toggleShowBody = () => {
    const { showBody } = this.state;
    this.setState({ showBody: !showBody });
  };

  render() {
    const { showBody } = this.state;

    const {
      cardStyle,
      cardHeaderStyle,
      cardHeaderColStyle,
      bodyStyle,
      bodyContent,
      headerContent,
      handleOnClick,
      observeOutside,
    } = this.props;

    return (
      <OutsideAlerter onOutsideAlert={observeOutside ? () => this.hideBody() : () => {}}>
        <FadeIn>
          <div className={"card" + (cardStyle ? " " + cardStyle : "")}>
            <div
              className={
                "card-header" + (cardHeaderStyle ? " " + cardHeaderStyle : "")
              }
            >
              <div className="row">
                <div
                  className={
                    "col-10" +
                    (cardHeaderColStyle ? " " + cardHeaderColStyle : "")
                  }
                  onClick={handleOnClick}
                >
                  {headerContent}
                </div>
                <div className="col-2">
                  <span
                    className="cursor-pointer float-right"
                    onClick={this.toggleShowBody}
                  >
                    <i className="fas fa-angle-down" />
                  </span>
                </div>
              </div>
            </div>
            {showBody && (
              <FadeIn>
                <div
                  className={"card-body" + (bodyStyle ? " " + bodyStyle : "")}
                >
                  {bodyContent}
                </div>
              </FadeIn>
            )}
          </div>
        </FadeIn>
      </OutsideAlerter>
    );
  }
}
