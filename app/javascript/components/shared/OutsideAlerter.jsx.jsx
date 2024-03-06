import { createRef, Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Component that alerts if you click outside of it
 */
export default class OutsideAlerter extends Component {
  constructor() {
    super();

    this.wrapperRef = createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleEscPressed = this.handleEscPressed.bind(this);
  }

  /**
   * Attach listeners on mount
   */
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('keydown', this.handleEscPressed);
  }

  /**
   * Dispose listeners on unmount
   */
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleEscPressed);
  }

  /**
   * Trigger the callback if the user clicked on outside of this component
   *
   * @param {MouseEvent} event
   */
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.props.onOutsideAlert();
    }
  }

  /**
   * Trigger the callback if the user clicked "esc"
   *
   * @param {KeyboardEvent} event
   */
  handleEscPressed(event) {
    if (event.code === 'Escape') {
      this.props.onOutsideAlert();
    }
  }

  render() {
    return <div ref={this.wrapperRef}>{this.props.children}</div>;
  }
}

OutsideAlerter.propTypes = {
  children: PropTypes.element.isRequired,
};
