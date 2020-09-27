import React, { Component } from "react";
import { Animated } from "react-animated-css";

export default class TermCard extends Component {
  state = {
    /**
     * The representation of the term for this component
     */
    selected: this.props.term.selected,
    animationisVisible: true,
    animationDuration: 250,
  };

  /**
   * Make both the term for this component and the one in the mapping,
   * selected or not selected
   */
  handleTermClick = () => {
    const { selected, animationDuration } = this.state;
    // Trigger animation
    this.setState(
      ({ animationisVisible }) => ({
        animationisVisible: !animationisVisible,
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
        }, animationDuration);
      }
    );
  };

  render() {
    const { selected, animationisVisible, animationDuration } = this.state;
    return (
      <Animated
        animationIn="fadeInDown"
        animationOut="fadeOutUp"
        animationInDuration={animationDuration}
        animationOutDuration={animationDuration}
        isVisible={animationisVisible}
      >
        <div
          className={
            "card with-shadow mb-2" +
            (this.props.term.mappedTo
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
                  {this.props.term.mappedTo ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <React.Fragment>
                      <button
                        onClick={() => {
                          this.props.onEditClick(this.props.term);
                        }}
                        className="btn"
                      >
                        <i className="fa fa-pencil-alt"></i>
                      </button>
                      <a
                        data-target={"#collapse-term-" + this.props.term.id}
                        data-toggle="collapse"
                        className="btn"
                        to="#"
                      >
                        <i className="fas fa-angle-down"></i>
                      </a>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            id={"collapse-term-" + this.props.term.id}
            className="collapse card-body pt-0 pb-0"
          >
            <p>{this.props.term.property.comment}</p>
            <p>{"Origin: " + ""}</p>
          </div>
        </div>
      </Animated>
    );
  }
}
