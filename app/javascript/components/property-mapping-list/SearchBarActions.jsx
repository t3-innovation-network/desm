import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { alignmentSortOptions, spineSortOptions } from './SortOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { valuesToOptions } from '../../helpers/FormHelpers';
import { i18n } from '../../utils/i18n';

/**
 * @description A complete row with a search bar to filter properties
 *
 * @prop {Function} onAlignmentOrderChange
 * @prop {Function} onHideSpineTermsWithNoAlignmentsChange
 * @prop {Function} onHide
 * @prop {Function} onSpineOrderChange
 * @prop {Function} onType
 * @prop {String} selectedAlignmentOrderOption
 * @prop {String} selectedSpineOrderOption
 */
const SearchBarActions = (props) => {
  const {
    onAlignmentOrderChange,
    onHide,
    onHideSpineTermsWithNoAlignmentsChange,
    onSpineOrderChange,
    onType,
    propertiesInputValue,
  } = props;

  const [inputValue, setInputValue] = useState(propertiesInputValue);
  const [hideSpineTermsWithNoAlignments, setHideSpineTermsWithNoAlignments] = useState(
    props.hideSpineTermsWithNoAlignments
  );
  const [selectedAlignmentOrderOption, setSelectedAlignmentOrderOption] = useState(
    props.selectedAlignmentOrderOption
  );
  const [selectedSpineOrderOption, setSelectedSpineOrderOption] = useState(
    props.selectedSpineOrderOption
  );
  const isApplySortDisabled =
    selectedAlignmentOrderOption === props.selectedAlignmentOrderOption &&
    selectedSpineOrderOption === props.selectedSpineOrderOption &&
    hideSpineTermsWithNoAlignments === props.hideSpineTermsWithNoAlignments;

  const handleOnType = (event) => {
    const val = event.target.value;
    setInputValue(val);
  };

  const handleHideSpineTermsWithNoAlignmentsChange = () => {
    setHideSpineTermsWithNoAlignments(!hideSpineTermsWithNoAlignments);
  };

  const handleSearchSubmit = () => {
    onType(inputValue);
    onHide();
  };

  const handleSortingApply = () => {
    onAlignmentOrderChange(selectedAlignmentOrderOption);
    onSpineOrderChange(selectedSpineOrderOption);
    onHideSpineTermsWithNoAlignmentsChange(hideSpineTermsWithNoAlignments);
    onHide();
  };

  return (
    <div className="row">
      <div className="col-12">
        <input
          type="search"
          className="form-control"
          placeholder={i18n.t('ui.properties_list.form.search_placeholder')}
          value={inputValue}
          onChange={handleOnType}
          autoFocus
        />
      </div>

      <div className="d-grid mt-2 mb-3 col-12">
        <button
          className="btn btn-primary"
          disabled={inputValue === propertiesInputValue}
          onClick={handleSearchSubmit}
        >
          <FontAwesomeIcon icon={faSearch} className="me-2" />
          {i18n.t('ui.properties_list.form.search')}
        </button>
      </div>

      <div className="col-12">
        <label className="form-label">{i18n.t('ui.properties_list.form.sort_spine_by')}</label>
        <Form.Select
          aria-label={i18n.t('ui.properties_list.form.sort_spine_by')}
          onChange={(e) => setSelectedSpineOrderOption(e.target.value)}
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
          onChange={(e) => setSelectedAlignmentOrderOption(e.target.value)}
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

      <div className="d-grid mt-2 col-12">
        <button
          className="btn btn-primary"
          disabled={isApplySortDisabled}
          onClick={handleSortingApply}
        >
          {i18n.t('ui.properties_list.form.sort')}
        </button>
      </div>
    </div>
  );
};

export default SearchBarActions;
