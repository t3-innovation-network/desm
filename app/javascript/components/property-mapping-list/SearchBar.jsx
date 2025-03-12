import { useState, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import { debounce } from 'lodash';
import { alignmentSortOptions, spineSortOptions } from './SortOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { DEBOUNCED_SEARCH_DELAY } from '../../utils/constants';
import { valuesToOptions } from '../../helpers/FormHelpers';
import { i18n } from '../../utils/i18n';

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
const SearchBar = (props) => {
  const {
    onAlignmentOrderChange,
    onHideSpineTermsWithNoAlignmentsChange,
    onSpineOrderChange,
    onType,
    hideSpineTermsWithNoAlignments,
    propertiesInputValue,
    selectedAlignmentOrderOption,
    selectedSpineOrderOption,
  } = props;

  const [inputValue, setInputValue] = useState(propertiesInputValue);
  const debouncedSearch = useCallback(
    debounce((val) => handleSearch(val), DEBOUNCED_SEARCH_DELAY),
    []
  );

  const handleOnType = (event) => {
    const val = event.target.value;
    setInputValue(val);
    // debounce onType action
    debouncedSearch(val);
  };

  const handleHideSpineTermsWithNoAlignmentsChange = () => {
    onHideSpineTermsWithNoAlignmentsChange(!hideSpineTermsWithNoAlignments);
  };

  const handleSearch = (val) => {
    onType(val);
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="form-group input-group">
          <input
            type="search"
            className="form-control"
            placeholder={i18n.t('ui.properties_list.form.search_placeholder')}
            value={inputValue}
            onChange={handleOnType}
            autoFocus
          />
          <span className="input-group-text">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
      </div>

      <div className="col-12">
        <label className="form-label">{i18n.t('ui.properties_list.form.sort_spine_by')}</label>
        <Form.Select
          aria-label={i18n.t('ui.properties_list.form.sort_spine_by')}
          onChange={(e) => onSpineOrderChange(e.target.value)}
          value={selectedSpineOrderOption}
        >
          {valuesToOptions(spineSortOptions)}
        </Form.Select>
      </div>

      <div className="col-12 mt-3">
        <label className="form-label">
          {i18n.t('ui.properties_list.form.sort_aligned_items_by')}
        </label>
        <Form.Select
          aria-label={i18n.t('ui.properties_list.form.sort_aligned_items_by')}
          onChange={(e) => onAlignmentOrderChange(e.target.value)}
          value={selectedAlignmentOrderOption}
        >
          {valuesToOptions(alignmentSortOptions)}
        </Form.Select>
      </div>

      <div className="col-12">
        <div className="form-check mt-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="hide-spine-elems"
            checked={hideSpineTermsWithNoAlignments}
            onChange={handleHideSpineTermsWithNoAlignmentsChange}
          />
          <label className="form-check-label" htmlFor="hide-spine-elems">
            {i18n.t('ui.properties_list.form.hide_spine_items_with_no_results')}
          </label>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
