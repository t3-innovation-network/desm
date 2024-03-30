import {} from 'react';
import { Component } from 'react';
import { FadeIn, SlideInDown } from './Animations.jsx';
import OutsideAlerter from './OutsideAlerter.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

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
          <>
            <button className="btn float-right p-1 icon--btn" disabled={disabled}>
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            <SlideInDown className="float-over" style={{ minWidth: 'max-content' }}>
              <div className="card">
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
          </>
        ) : (
          <FadeIn>
            <button
              className="btn float-right p-1 icon--btn"
              onClick={() => this.setState({ expanded: true })}
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
          </FadeIn>
        )}
      </OutsideAlerter>
    );
  }
}

export default EllipsisOptions;
