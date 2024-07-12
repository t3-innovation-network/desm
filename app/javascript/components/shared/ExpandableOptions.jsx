import { Component } from 'react';
import { SlideInDown, FadeIn } from './Animations.jsx';
import OutsideAlerter from './OutsideAlerter.jsx';

/**
 * Props:
 * @prop {Boolean} expanded
 * @prop {String} selectedOption
 * @prop {Component} SelectedComponent
 * @prop {Function} onClose
 * @prop {Function} onExpand
 * @prop {Array} options
 */
class ExpandableOptions extends Component {
  state = {
    expanded: this.props.expanded || false,
    selectedOption: this.props.selectedOption,
  };

  handleShrink = () => {
    this.setState({ expanded: false });
  };

  handleOptionClick = (option) => {
    const { onClose } = this.props;
    this.setState({ selectedOption: option.name }, () => {
      this.setState({ expanded: false });

      if (onClose) {
        onClose(option);
      }
    });
  };

  handleExpand = () => {
    const { onExpand } = this.props;
    this.setState({ expanded: true }, () => {
      if (onExpand) {
        onExpand();
      }
    });
  };

  render() {
    const { expanded, selectedOption } = this.state;
    const { cardCssClass, cardHeaderCssClass, SelectedComponent } = this.props;

    return (
      <OutsideAlerter onOutsideAlert={() => this.handleShrink()}>
        {expanded ? (
          <SlideInDown className="float-over">
            <div className={'card' + (cardCssClass ? ' ' + cardCssClass : '')}>
              {this.props.options.map((option) => {
                return (
                  <div
                    key={option.id}
                    className="p-2 cursor-pointer hover-col-primary border-bottom"
                    onClick={() => this.handleOptionClick(option)}
                  >
                    {option.name}
                    {option.description && (
                      <div className="text-muted lh-sm">
                        <small>{option.description}</small>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </SlideInDown>
        ) : (
          <FadeIn>
            <div className={'card' + (cardCssClass ? ' ' + cardCssClass : '')}>
              <div
                className={
                  'card-header cursor-pointer' +
                  (cardHeaderCssClass ? ' ' + cardHeaderCssClass : '')
                }
                onClick={this.handleExpand}
              >
                <div className="row">
                  <div className="col-10">
                    {SelectedComponent ? (
                      <SelectedComponent selectedOption={selectedOption} />
                    ) : (
                      <strong>{selectedOption}</strong>
                    )}
                  </div>
                  <div className="col">
                    <span className="float-right">▼</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}
      </OutsideAlerter>
    );
  }
}

export default ExpandableOptions;
