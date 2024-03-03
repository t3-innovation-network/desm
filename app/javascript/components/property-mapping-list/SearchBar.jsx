import { Component } from 'react';
import { iterableSelectableOptions } from '../../helpers/Iterables';
import ExpandableOptions from '../shared/ExpandableOptions';
import { alignmentSortOptions, spineSortOptions } from './SortOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

/**
 * @description A complete row with a search bar to filter properties
 *
 * @prop {Function} onAlignmentOrderChange
 * @prop {Function} onHideSpineTermsWithNoAlignmentsChange
 * @prop {Function} onSpineOrderChange
 * @prop {Function} onType Actions when a character is typed
 * @prop {String} selectedAlignmentOrderOption
 * @prop {String} selectedSpineOrderOption
 */
export default class SearchBar extends Component {
  /**
   * Values in state
   */
  state = {
    /**
     * The typed characters in the searchbox
     */
    inputValue: '',
    /**
     * Flag to determine whether to show or not the spine terms with no mapped terms
     */
    hideSpineTermsWithNoAlignments: false,
    /**
     * The order the user wants to see the spine terms
     */
    selectedAlignmentOrderOption: this.props.selectedAlignmentOrderOption,
    /**
     * The order the user wants to see the spine terms
     */
    selectedSpineOrderOption: this.props.selectedSpineOrderOption,
  };

  /**
   * Actions when a character is typed in the searchbox
   *
   * @param {Event} event
   */
  handleOnType = (event) => {
    const { onType } = this.props;
    const val = event.target.value;

    this.setState({ inputValue: val }, () => {
      if (onType) {
        onType(val);
      }
    });
  };

  /**
   * Handle to perform the necessary the actions when the user clicks on the checkbox to hide/show
   * the spine terms with no mapped properties.
   */
  handleHideSpineTermsWithNoAlignmentsChange = () => {
    const { hideSpineTermsWithNoAlignments } = this.state;
    const { onHideSpineTermsWithNoAlignmentsChange } = this.props;

    this.setState({
      hideSpineTermsWithNoAlignments: !hideSpineTermsWithNoAlignments,
    });

    onHideSpineTermsWithNoAlignmentsChange(!hideSpineTermsWithNoAlignments);
  };

  /**
   * Actions to perform when the user selects a different spine term order option
   *
   * @param {String} option
   */
  handleSpineOrderOptionsChanged = (option) => {
    const { onSpineOrderChange } = this.props;

    this.setState({ selectedSpineOrderOption: option });

    if (onSpineOrderChange) {
      onSpineOrderChange(option);
    }
  };

  /**
   * Actions to perform when the user selects a different alignment order option
   *
   * @param {String} option
   */
  handleAlignmentOrderOptionsChanged = (option) => {
    const { onAlignmentOrderChange } = this.props;

    this.setState({ selectedAlignmentOrderOption: option });

    if (onAlignmentOrderChange) {
      onAlignmentOrderChange(option);
    }
  };

  render() {
    /**
     * Elements from state
     */
    const {
      inputValue,
      hideSpineTermsWithNoAlignments,
      selectedAlignmentOrderOption,
      selectedSpineOrderOption,
    } = this.state;

    return (
      <div className="row mt-4">
        <div className="col-3">
          <hr className="bottom-border-white" />
          <div className="form-group input-group-has-icon">
            <FontAwesomeIcon icon={faSearch} className="form-control-feedback" />
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search for an Element / Property"
              value={inputValue}
              onChange={this.handleOnType}
              autoFocus
            />
          </div>
        </div>

        <div className="col-3">
          <label>Sort Spine By</label>
          <ExpandableOptions
            cardHeaderCssClass={'bottom-borderless'}
            onClose={(option) => this.handleSpineOrderOptionsChanged(option.name)}
            options={iterableSelectableOptions(_.values(spineSortOptions))}
            selectedOption={selectedSpineOrderOption}
          />
        </div>

        <div className="col-3">
          <label>Sort Aligned Items By</label>
          <ExpandableOptions
            cardHeaderCssClass={'bottom-borderless'}
            options={iterableSelectableOptions(_.values(alignmentSortOptions))}
            onClose={(option) => this.handleAlignmentOrderOptionsChanged(option.name)}
            selectedOption={selectedAlignmentOrderOption}
          />
        </div>

        <div className="col-3">
          <hr className="bottom-border-white" />
          <div className="custom-control custom-checkbox mt-3">
            <input
              type="checkbox"
              className="custom-control-input desm-custom-control-input"
              id="hide-spine-elems"
              value={hideSpineTermsWithNoAlignments}
              onChange={() => this.handleHideSpineTermsWithNoAlignmentsChange()}
            />
            <label className="custom-control-label" htmlFor="hide-spine-elems">
              Hide spine items with no results
            </label>
          </div>
        </div>
      </div>
    );
  }
}
