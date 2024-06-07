import { Component } from 'react';
import HoverableLabel from '../shared/HoverableLabel';

/**
 * Props
 * @param {Array} specifications
 * @param {Function} onAlignmentSpecificationSelected
 * @param {Function} onPredicateSelected
 * @param {Function} onSpineSpecificationSelected
 * @param {Array} predicates
 * @param {Array} selectedAlignmentSpecifications
 * @param {String} selectedDomain
 * @param {Array} selectedPredicates
 * @param {Array} selectedSpineSpecifications
 */
export default class PropertyMappingsFilter extends Component {
  /**
   * State definition
   */
  state = {
    showFilters: false,
  };

  /**
   * Show/Hide the Filter
   */
  ToggleFilters = () => {
    const { showFilters } = this.state;

    return (
      <div className="mb-3" onClick={() => this.setState({ showFilters: !showFilters })}>
        <button className="btn btn-dark mr-3">{showFilters ? '▲' : '▼'}</button>
        <label className="cursor-pointer non-selectable">
          {(showFilters ? 'Hide' : 'Show') + ' Filters'}
        </label>
      </div>
    );
  };

  /**
   * Actions when a user selects an specification from the spine specifications filter
   *
   * @param {Integer} specId
   */
  handleSpineOrganizationSelected = (specId) => {
    const {
      onSpineSpecificationSelected,
      specifications,
      selectedSpineSpecifications,
    } = this.props;

    const isSelected = selectedSpineSpecifications.some((s) => s.id == specId);

    const tempselectedSpineSpecifications = isSelected
      ? selectedSpineSpecifications.filter((s) => s.id != specId)
      : [...selectedSpineSpecifications, specifications.find((s) => s.id == specId)];

    onSpineSpecificationSelected(tempselectedSpineSpecifications);
  };

  /**
   * Actions when a user selects an specification from the spine specifications filter
   *
   * @param {Integer} specId
   */
  handleAlignmentOrganizationSelected = (specId) => {
    const {
      onAlignmentSpecificationSelected,
      specifications,
      selectedAlignmentSpecifications,
    } = this.props;

    const isSelected = selectedAlignmentSpecifications.some((s) => s.id == specId);

    const tempselectedAlignmentSpecifications = isSelected
      ? selectedAlignmentSpecifications.filter((s) => s.id != specId)
      : [...selectedAlignmentSpecifications, specifications.find((s) => s.id == specId)];

    onAlignmentSpecificationSelected(tempselectedAlignmentSpecifications);
  };

  /**
   * Actions when a user selects a predicate from the filter
   *
   * @param {Integer} predicateId
   */
  handlePredicateSelected = (predicateId) => {
    const { onPredicateSelected, predicates, selectedPredicates } = this.props;

    let isSelected = selectedPredicates.some((sPredicate) => sPredicate.id == predicateId);

    let tempSelectedPredicates;
    if (isSelected) {
      tempSelectedPredicates = selectedPredicates.filter(
        (sPredicate) => sPredicate.id != predicateId
      );
    } else {
      tempSelectedPredicates = [
        ...selectedPredicates,
        predicates.find((sPredicate) => sPredicate.id == predicateId),
      ];
    }

    onPredicateSelected(tempSelectedPredicates);
  };

  /**
   * The options to select on specification to show spines
   */
  SpineOrganizationOptions = () => {
    const {
      specifications,
      selectedSpineSpecifications,
      onSpineSpecificationSelected,
    } = this.props;

    return (
      <>
        <label
          className="col-primary cursor-pointer non-selectable mb-3"
          onClick={() => {
            !selectedSpineSpecifications.length
              ? onSpineSpecificationSelected(specifications)
              : onSpineSpecificationSelected([]);
          }}
        >
          {!selectedSpineSpecifications.length ? 'Show All' : 'Hide All'}
        </label>

        {specifications.map((spec) => {
          return (
            <div className="custom-control custom-checkbox mb-3" key={spec.id}>
              <input
                type="checkbox"
                className="custom-control-input desm-custom-control-input"
                id={`spec-chk-${spec.id}`}
                checked={selectedSpineSpecifications.some((sOrg) => sOrg.id === spec.id)}
                onChange={(e) => this.handleSpineOrganizationSelected(e.target.value)}
                value={spec.id}
              />
              <label
                className="custom-control-label cursor-pointer"
                htmlFor={`spec-chk-${spec.id}`}
              >
                {spec.name} {spec.version ? `(${spec.version})` : ''}
              </label>
            </div>
          );
        })}
      </>
    );
  };

  /**
   * The options to select on specification to show alignments
   */
  AlignmentOrganizationOptions = () => {
    const {
      specifications,
      selectedAlignmentSpecifications,
      onAlignmentSpecificationSelected,
    } = this.props;

    return (
      <>
        <label
          className="col-primary cursor-pointer non-selectable mb-3"
          onClick={() => {
            !selectedAlignmentSpecifications.length
              ? onAlignmentSpecificationSelected(specifications)
              : onAlignmentSpecificationSelected([]);
          }}
        >
          {!selectedAlignmentSpecifications.length ? 'Show All' : 'Hide All'}
        </label>

        {specifications.map((spec) => {
          return (
            <div className="custom-control custom-checkbox mb-3" key={spec.id}>
              <input
                type="checkbox"
                className="custom-control-input desm-custom-control-input"
                id={`al-spec-chk-${spec.id}`}
                checked={selectedAlignmentSpecifications.some((s) => s.id === spec.id)}
                onChange={(e) => this.handleAlignmentOrganizationSelected(e.target.value)}
                value={spec.id}
              />
              <label
                className="custom-control-label cursor-pointer"
                htmlFor={`al-spec-chk-${spec.id}`}
              >
                {spec.name} {spec.version ? `(${spec.version})` : ''}
              </label>
            </div>
          );
        })}
      </>
    );
  };

  /**
   * The options to list in the filter for alignments
   */
  AlignmentOptions = () => {
    const { predicates, selectedPredicates, onPredicateSelected } = this.props;

    return (
      <>
        <label
          className="col-primary cursor-pointer non-selectable mb-3"
          onClick={() => {
            !selectedPredicates.length ? onPredicateSelected(predicates) : onPredicateSelected([]);
          }}
        >
          {!selectedPredicates.length ? 'Show All' : 'Hide All'}
        </label>

        {predicates.map((predicate) => {
          return (
            <div className="custom-control custom-checkbox mb-3" key={predicate.id}>
              <input
                type="checkbox"
                className="custom-control-input desm-custom-control-input"
                id={'pred-chk-' + predicate.id}
                checked={selectedPredicates.some((sPredicate) => sPredicate.id === predicate.id)}
                onChange={(e) => this.handlePredicateSelected(e.target.value)}
                value={predicate.id}
              />
              <label
                className="custom-control-label cursor-pointer"
                htmlFor={'pred-chk-' + predicate.id}
              >
                {predicate.pref_label}
              </label>
            </div>
          );
        })}
      </>
    );
  };

  render() {
    /**
     * Elements from state
     */
    const { showFilters } = this.state;
    /**
     * Elements from props
     */
    const { selectedDomain } = this.props;

    return showFilters ? (
      /// EXPANDED FILTERS
      <div className="row top-border-strong bg-col-secondary">
        <div className="col-2 mt-3">
          <this.ToggleFilters />
          <div className="card mt-5">
            <div className="card-body">
              <strong>Synthetic Spine</strong>
              <div>
                <label className="col-primary">
                  <strong>{selectedDomain.name}</strong>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-3 mt-3">
          <div className="card borderless">
            <div className="card-header bottom-borderless bg-col-secondary">
              <label className="non-selectable">
                <strong>Show Spine Specifications</strong>
              </label>
            </div>
            <div className="card-body bg-col-secondary">
              <this.SpineOrganizationOptions />
            </div>
          </div>
        </div>
        <div className="col-3 mt-3">
          <div className="card borderless">
            <div className="card-header bottom-borderless bg-col-secondary">
              <label className="non-selectable">
                <strong>Show Alignments Specifications</strong>
              </label>
            </div>
            <div className="card-body bg-col-secondary">
              <this.AlignmentOrganizationOptions />
            </div>
          </div>
        </div>
        <div className="col-3 mt-3">
          <div className="card borderless">
            <div className="card-header bottom-borderless bg-col-secondary">
              <label className="non-selectable">
                <strong>Show Alignments</strong>
              </label>
            </div>
            <div className="card-body bg-col-secondary">
              <this.AlignmentOptions />
            </div>
          </div>
        </div>
      </div>
    ) : (
      /// END EXPANDED FILTERS
      /// SHRINKED FILTERS
      <div className="row top-border-strong bg-col-secondary">
        <div className="col-2 mt-3">
          <this.ToggleFilters />
        </div>
        <div className="col-3 mt-3">
          <HoverableLabel
            label={'Show Spine Specifications'}
            labelCSSClass={'bg-col-secondary'}
            content={<this.SpineOrganizationOptions />}
          />
        </div>
        <div className="col-3 mt-3">
          <HoverableLabel
            label={'Show Alignments Specifications'}
            labelCSSClass={'bg-col-secondary'}
            content={<this.AlignmentOrganizationOptions />}
          />
        </div>
        <div className="col-3 mt-3">
          <HoverableLabel
            label={'Show Alignments'}
            labelCSSClass={'bg-col-secondary'}
            content={<this.AlignmentOptions />}
          />
        </div>
      </div>
      /// END SHRINKED FILTERS
    );
  }
}
