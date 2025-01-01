import { Component } from 'react';

/**
 * Props:
 * @param {String} forComponent attribute to use as "for" in the label tag
 * @param {JSX} primaryContent The content that's always visible
 * @param {JSX} secondaryContent The content that only appears when the mouse is over the label
 */
class HoverableText extends Component {
  state = {
    /**
     * Controls the hover (mouse over) action to this component
     */
    hovering: false,
  };

  render() {
    /**
     * Elements from props
     */
    const { forComponent, primaryContent, secondaryContent } = this.props;
    /**
     * Elements from state
     */
    const { hovering } = this.state;

    return (
      <label
        className="form-label"
        onMouseEnter={() => this.setState({ hovering: true })}
        onMouseLeave={() => this.setState({ hovering: false })}
        htmlFor={forComponent}
      >
        <span>{primaryContent}</span>
        {hovering ? <span style={{ color: 'grey' }}>{' - ' + secondaryContent}</span> : null}
      </label>
    );
  }
}

export default HoverableText;
