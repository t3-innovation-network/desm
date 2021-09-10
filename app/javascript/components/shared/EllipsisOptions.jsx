import React from "react";
import { Fragment } from "react";
import { Component } from "react";
import { FadeIn, SlideInDown } from "./Animations.jsx";
import OutsideAlerter from "./OutsideAlerter.jsx";

/**
 * @prop {Boolean} expanded
 * @prop {Function} onOptionSelected
 * @prop {Array} options
 */
class EllipsisOptions extends Component {
  state = {
    expanded: this.props.expanded || false,
    disabled: this.props.disabled || false,
  };

  handleShrink = () => {
    this.setState({ expanded: false });
  };

  handleOptionSelected = (option) => {
    const { onOptionSelected } = this.props;
    this.setState({ expanded: false }, () => {
      if (onOptionSelected) {
        onOptionSelected(option);
      }
    });
  };

  render() {
    const { options } = this.props;
    const { disabled, expanded } = this.state;

    return (
      <OutsideAlerter onOutsideAlert={() => this.handleShrink()}>
        {expanded ? (
          <Fragment>
            <button className="btn float-right" disabled={disabled}>
              <i className="fas fa-ellipsis-v" />
            </button>
            <SlideInDown className="float-over">
              <div className={"card"}>
                {options.map((option) => {
                  return (
                    <div
                      key={option.id}
                      className="p-2 cursor-pointer hover-col-primary border-bottom"
                      onClick={() => this.handleOptionSelected(option)}
                    >
                      {option.name}
                    </div>
                  );
                })}
              </div>
            </SlideInDown>
          </Fragment>
        ) : (
          <FadeIn>
            <button
              className="btn float-right"
              onClick={() => this.setState({ expanded: true })}
            >
              <i className="fas fa-ellipsis-v" />
            </button>
          </FadeIn>
        )}
      </OutsideAlerter>
    );
  }
}

export default EllipsisOptions;
