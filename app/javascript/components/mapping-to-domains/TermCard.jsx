import React, { Component } from "react";
import { Animated } from "react-animated-css";

export default class TermCard extends Component {
  state = {
    /**
     * Whether the term is selected or not
     */
    selected: this.props.term.selected,
    /**
     * The animation of the whole term card status
     */
    cardAnimationisVisible: true,
    /**
     * The animation of the term body card status
     */
    termBodyAnimationisVisible: false,
    /**
     * Whether the term body is visible or not
     */
    showTermBody: false,
    /**
     * The card animation duration in miliseconds
     */
    cardAnimationDuration: 250,
    /**
     * The term body animation duration in miliseconds
     */
    termBodyAnimationDuration: 500,
  };

  /**
   * Make both the term for this component and the one in the mapping,
   * selected or not selected
   */
  handleTermClick = () => {
    if (!this.props.isMapped(this.props.term)) {
      const { selected, cardAnimationDuration } = this.state;
      // Trigger animation
      this.setState(
        ({ cardAnimationisVisible }) => ({
          cardAnimationisVisible: !cardAnimationisVisible,
        }),
        () => {
          // Await until the animation finishes. Otherwise the term just roughly dissapears
          setTimeout(() => {
            // local value (this term)
            this.setState(
              ({ selected }) => ({
                selected: !selected,
              }),
              () => {
                // props value (the term inside the list in the parent component)
                this.props.term.selected = !this.props.term.selected;
                this.props.onClick(this.props.term);
              }
            );
          }, cardAnimationDuration);
        }
      );
    }
  };

  toggleShowBody = () => {
    const {
      termBodyAnimationisVisible,
      termBodyAnimationDuration,
      showTermBody,
    } = this.state;

    // Trigger animation
    this.setState(
      ({ termBodyAnimationisVisible }) => ({
        termBodyAnimationisVisible: !termBodyAnimationisVisible,
      }),
      () => {
        if (!showTermBody) {
          // Change term visibility
          this.setState(({ showTermBody }) => ({
            showTermBody: !showTermBody,
          }));
          return;
        }

        // Await until the animation finishes. Otherwise the term just roughly dissapears
        setTimeout(() => {
          // Change term visibility
          this.setState(({ showTermBody }) => ({
            showTermBody: !showTermBody,
          }));
        }, termBodyAnimationDuration);
      }
    );
  };

  render() {
    const {
      selected,
      cardAnimationisVisible,
      cardAnimationDuration,
      termBodyAnimationisVisible,
      termBodyAnimationDuration,
      showTermBody,
    } = this.state;
    return (
      <Animated
        animationIn="fadeInDown"
        animationOut="fadeOutUp"
        animationInDuration={cardAnimationDuration}
        animationOutDuration={cardAnimationDuration}
        isVisible={cardAnimationisVisible}
      >
        <div
          className={
            "card with-shadow mb-2" +
            (this.props.isMapped(this.props.term)
              ? " disabled-container not-draggable"
              : selected
              ? " draggable term-selected"
              : "")
          }
        >
          <div className="card-header no-color-header pb-0">
            <div className="row">
              <div
                className={"col-8 mb-3" + (selected ? "" : " cursor-pointer")}
                onClick={this.handleTermClick}
              >
                {this.props.term.name}
              </div>
              <div className="col-4">
                <div className="float-right">
                  {this.props.isMapped(this.props.term) ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <React.Fragment>
                      {this.props.editEnabled && (
                        <button
                          onClick={() => {
                            this.props.onEditClick(this.props.term);
                          }}
                          className="btn"
                        >
                          <i className="fa fa-pencil-alt"></i>
                        </button>
                      )}
                      <button className="btn" onClick={this.toggleShowBody}>
                        <i className="fas fa-angle-down"></i>
                      </button>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Animated
            animationIn="fadeIn"
            animationOut="fadeOut"
            animationInDuration={termBodyAnimationDuration}
            animationOutDuration={termBodyAnimationDuration}
            isVisible={termBodyAnimationisVisible}
          >
            {showTermBody && (
              <div className="card-body pt-0 pb-0">
                <p>{this.props.term.property.comment}</p>
                <p>{"Origin: " + this.props.origin}</p>
              </div>
            )}
          </Animated>
        </div>
      </Animated>
    );
  }
}
