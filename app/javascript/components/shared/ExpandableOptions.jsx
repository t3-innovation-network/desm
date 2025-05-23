import { Component } from 'react';
import Fade from 'react-bootstrap/Fade';
import Collapse from 'react-bootstrap/Collapse';
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
          <Collapse in={expanded} className="float-over">
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
                      <div className="text-body-secondary lh-sm">
                        <small>{option.description}</small>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Collapse>
        ) : (
          <Fade in={!expanded}>
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
                    <span className="float-end">▼</span>
                  </div>
                </div>
              </div>
            </div>
          </Fade>
        )}
      </OutsideAlerter>
    );
  }
}

export default ExpandableOptions;
