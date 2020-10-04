import React, { Component, useState } from "react";
import { Animated } from "react-animated-css";

export default class SpineTermCard extends Component {
  state = {
    animationIsVisible: false,
    showTerm: false,
    animationDuration: 500,
  };

  toggleShowBody = () => {
    const { animationIsVisible, animationDuration, showTerm } = this.state;

    // Trigger animation
    this.setState(
      ({ animationIsVisible }) => ({
        animationIsVisible: !animationIsVisible,
      }),
      () => {
        if (!showTerm) {
          // Change term visibility
          this.setState(({ showTerm }) => ({
            showTerm: !showTerm,
          }));
          return;
        }

        // Await until the animation finishes. Otherwise the term just roughly dissapears
        setTimeout(() => {
          // Change term visibility
          this.setState(({ showTerm }) => ({
            showTerm: !showTerm,
          }));
        }, animationDuration);
      }
    );
  };

  render() {
    const { animationIsVisible, animationDuration, showTerm } = this.state;

    const { term } = this.props;

    return (
      <div className="card">
        <div
          className="card-header cursor-pointer pb-0"
          onClick={this.toggleShowBody}
        >
          <p>
            <strong>{term.name}</strong>
            <i className="fas fa-angle-down float-right"></i>
          </p>
        </div>
        <Animated
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInDuration={animationDuration}
          animationOutDuration={animationDuration}
          isVisible={animationIsVisible}
        >
          {showTerm && <div className="card-body">{term.property.comment}</div>}
        </Animated>
      </div>
    );
  }
}
