import { Component } from 'react';
import { FadeIn } from './Animations.jsx';
import OutsideAlerter from './OutsideAlerter.jsx';

/**
 * Props:
 * @prop {Function} handleOnClick
 * @prop {String} cardStyle,
 * @prop {String} cardHeaderStyle,
 * @prop {String} cardHeaderColStyle,
 * @prop {String} bodyStyle,
 * @prop {React.Component} bodyContent,
 * @prop {React.Component} headerContent,
 * @prop {Boolean} observeOutside Whether this component should react or not on an outside event
 * @prop {Boolean} expanded
 */
export default class Collapsible extends Component {
  state = {
    /**
     * Whether the term body is visible or not
     */
    showBody: Boolean(this.props.expanded),
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
      observeOutside,
    } = this.props;

    return (
      <OutsideAlerter onOutsideAlert={observeOutside ? () => this.hideBody() : () => {}}>
        <FadeIn>
          <div className={'card' + (cardStyle ? ' ' + cardStyle : '')}>
            <div className={'card-header' + (cardHeaderStyle ? ' ' + cardHeaderStyle : '')}>
              <div className="row">
                <div
                  className={'col-10' + (cardHeaderColStyle ? ' ' + cardHeaderColStyle : '')}
                  onClick={this.handleClick}
                >
                  {headerContent}
                </div>
                <div className="col">
                  <span className="cursor-pointer float-right" onClick={this.toggleShowBody}>
                    {showBody ? '▲' : '▼'}
                  </span>
                </div>
              </div>
            </div>
            {showBody && (
              <FadeIn>
                <div className={'card-body' + (bodyStyle ? ' ' + bodyStyle : '')}>
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
