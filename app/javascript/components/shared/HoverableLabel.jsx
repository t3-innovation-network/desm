import { Component } from 'react';
import { transparentCardStyle } from './Styles';

/**
 * Props:
 * @param {String} label
 * @param {JSX} content
 * @param {String} labelCSSClass
 */
export default class HoverableLabel extends Component {
  /**
   * State of this component
   */
  state = {
    showing: false,
  };

  render() {
    /**
     * Elements from state
     */
    const { label, content, labelCSSClass } = this.props;
    /**
     * Elements from state
     */
    const { showing } = this.state;

    return (
      <div
        className="row cursor-pointer"
        onMouseEnter={() => {
          this.setState({ showing: true });
        }}
        onMouseLeave={() => {
          this.setState({ showing: false });
        }}
      >
        <div className="col">
          <div
            className={'card' + (showing ? ' with-shadow' : ' borderless')}
            style={transparentCardStyle}
          >
            <div
              className={
                'card-header bottom-borderless' + (labelCSSClass ? ' ' + labelCSSClass : '')
              }
            >
              <div className="row">
                <div className="col-10 cursor-pointer">
                  <label className="form-label non-selectable">{label}</label>
                </div>
                <div className="col-2 cursor-pointer">{showing ? '▲' : '▼'}</div>
              </div>
            </div>
            {showing && <div className="card-body">{content}</div>}
          </div>
        </div>
      </div>
    );
  }
}
