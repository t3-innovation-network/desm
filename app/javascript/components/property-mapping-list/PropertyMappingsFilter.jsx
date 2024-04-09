import { Component } from 'react';
import HoverableLabel from '../shared/HoverableLabel';

/**
 * Props
 * @param {Array} organizations
 * @param {Function} onAlignmentOrganizationSelected
 * @param {Function} onPredicateSelected
 * @param {Function} onSpineOrganizationSelected
 * @param {Array} predicates
 * @param {Array} selectedAlignmentOrganizations
 * @param {String} selectedDomain
 * @param {Array} selectedPredicates
 * @param {Array} selectedSpineOrganizations
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
   * Actions when a user selects an organization from the spine organizations filter
   *
   * @param {Integer} orgId
   */
  handleSpineOrganizationSelected = (orgId) => {
    const { onSpineOrganizationSelected, organizations, selectedSpineOrganizations } = this.props;

    let isSelected = selectedSpineOrganizations.some((sOrg) => sOrg.id == orgId);

    let tempSelectedSpineOrganizations;
    if (isSelected) {
      tempSelectedSpineOrganizations = selectedSpineOrganizations.filter((org) => org.id != orgId);
    } else {
      tempSelectedSpineOrganizations = [
        ...selectedSpineOrganizations,
        organizations.find((org) => org.id == orgId),
      ];
    }

    onSpineOrganizationSelected(tempSelectedSpineOrganizations);
  };

  /**
   * Actions when a user selects an organization from the spine organizations filter
   *
   * @param {Integer} orgId
   */
  handleAlignmentOrganizationSelected = (orgId) => {
    const {
      onAlignmentOrganizationSelected,
      organizations,
      selectedAlignmentOrganizations,
    } = this.props;

    let isSelected = selectedAlignmentOrganizations.some((sOrg) => sOrg.id == orgId);

    let tempSelectedAlignmentOrganizations;
    if (isSelected) {
      tempSelectedAlignmentOrganizations = selectedAlignmentOrganizations.filter(
        (org) => org.id != orgId
      );
    } else {
      tempSelectedAlignmentOrganizations = [
        ...selectedAlignmentOrganizations,
        organizations.find((org) => org.id == orgId),
      ];
    }

    onAlignmentOrganizationSelected(tempSelectedAlignmentOrganizations);
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
   * The options to select on organization to show spines
   */
  SpineOrganizationOptions = () => {
    const { organizations, selectedSpineOrganizations, onSpineOrganizationSelected } = this.props;

    return (
      <>
        <label
          className="col-primary cursor-pointer non-selectable mb-3"
          onClick={() => {
            !selectedSpineOrganizations.length
              ? onSpineOrganizationSelected(organizations)
              : onSpineOrganizationSelected([]);
          }}
        >
          {!selectedSpineOrganizations.length ? 'Show All' : 'Hide All'}
        </label>

        {organizations.map((org) => {
          return (
            <div className="custom-control custom-checkbox mb-3" key={org.id}>
              <input
                type="checkbox"
                className="custom-control-input desm-custom-control-input"
                id={'org-chk-' + org.id}
                checked={selectedSpineOrganizations.some((sOrg) => sOrg.id === org.id)}
                onChange={(e) => this.handleSpineOrganizationSelected(e.target.value)}
                value={org.id}
              />
              <label className="custom-control-label cursor-pointer" htmlFor={'org-chk-' + org.id}>
                {org.name}
              </label>
            </div>
          );
        })}
      </>
    );
  };

  /**
   * The options to select on organization to show alignments
   */
  AlignmentOrganizationOptions = () => {
    const {
      organizations,
      selectedAlignmentOrganizations,
      onAlignmentOrganizationSelected,
    } = this.props;

    return (
      <>
        <label
          className="col-primary cursor-pointer non-selectable mb-3"
          onClick={() => {
            !selectedAlignmentOrganizations.length
              ? onAlignmentOrganizationSelected(organizations)
              : onAlignmentOrganizationSelected([]);
          }}
        >
          {!selectedAlignmentOrganizations.length ? 'Show All' : 'Hide All'}
        </label>

        {organizations.map((org) => {
          return (
            <div className="custom-control custom-checkbox mb-3" key={org.id}>
              <input
                type="checkbox"
                className="custom-control-input desm-custom-control-input"
                id={'al-org-chk-' + org.id}
                checked={selectedAlignmentOrganizations.some((sOrg) => sOrg.id === org.id)}
                onChange={(e) => this.handleAlignmentOrganizationSelected(e.target.value)}
                value={org.id}
              />
              <label
                className="custom-control-label cursor-pointer"
                htmlFor={'al-org-chk-' + org.id}
              >
                {org.name}
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
