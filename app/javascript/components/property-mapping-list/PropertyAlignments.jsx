import { Component } from 'react';
import Loader from '../shared/Loader';
import { implementAlignmentSort } from './SortOptions';

/**
 * @description A list of alignments with information like predicate, comment, and more.
 *   The alignments are built in form of separate cards.
 *
 * Props:
 * @param {Object} spineTerm The term of the spine to look for alignments
 * @param {Array} selectedPredicates The list of predicates selected by the user in the filter
 * @param {String} selectedAlignmentOrderOption The option selected by the user to order the list of alignments
 * @param {Array} selectedAlignmentOrganizations The list of organizations that made alignments, selected by the user
 *   in the filter.
 * @param {Array} selectedSpineOrganizations The list of organizations that has properties with alignments, selected
 *   by the user in the filter. This refers to the origin of the property. Initially, a spine specification will have
 *   all its properties with the same organization. When a synthetic property is created, it will keep the organization
 *   of origin.
 */
export default class PropertyAlignments extends Component {
  /**
   * Representation of the state of this component
   */
  state = {
    /**
     * List of alignments being shown
     */
    alignments: this.props.spineTerm.alignments,
    /**
     * Representation of an errors on this page process
     */
    errors: [],
    /**
     * Whether the page is loading results or not
     */
    loading: true,
  };

  /**
   * The list of ids for the selected predicates
   */
  selectedPredicateIds = () => this.props.selectedPredicates.map((predicate) => predicate.id);

  /**
   * The list of ids for the selected alignment organizations
   */
  selectedAlignmentOrganizationIds = () =>
    this.props.selectedAlignmentOrganizations.map((org) => org.id);

  /**
   * The list of ids for the selected spine organizations
   */
  selectedSpineOrganizationIds = () => this.props.selectedSpineOrganizations.map((org) => org.id);

  /**
   * The list of alignments filtered using the values in the filters bar
   */
  filteredAlignments = () => {
    const { spineTerm, selectedAlignmentOrderOption } = this.props;
    const { alignments } = this.state;

    let filteredAl = alignments.filter(
      (alignment) =>
        /// It matches the selected predicates
        this.selectedPredicateIds().includes(alignment.predicateId) &&
        /// It matches the selected alignment organizations
        alignment.mappedTerms.some((mTerm) =>
          this.selectedAlignmentOrganizationIds().includes(mTerm.organization.id)
        ) &&
        /// It matches the selected alignment organizations
        this.selectedSpineOrganizationIds().includes(spineTerm.organization.id)
    );

    return implementAlignmentSort(filteredAl, selectedAlignmentOrderOption);
  };

  render() {
    /**
     * Elements from props
     */
    const { loading } = this.props;

    return loading ? (
      <Loader />
    ) : (
      this.filteredAlignments().map((alignment) => {
        return alignment.mappedTerms.length ? (
          <AlignmentCard alignment={alignment} key={alignment.id} />
        ) : (
          ''
        );
      })
    );
  }
}

/**
 * Props:
 * @param {Object} alignment
 */
class AlignmentCard extends Component {
  state = {
    /**
     * Whether we are rendering the alignment comment
     */
    showingAlignmentComment: false,
  };

  /**
   * Since there could be more than only 1 term mapped to a spine term,
   * this method will merge the desired property among all the mapped terms.
   *
   * It's usually only 1, but there may be cases when more than 1 term is mapped
   * to a spine term.
   *
   * @param {String} propertyName The name of the property to look after
   */
  printMappedTermProperty = (propertyName) => {
    const { alignment } = this.props;

    return alignment.mappedTerms.reduce((a, b) => a + (b[propertyName] + ', '), '').slice(0, -2);
  };

  /**
   * Since there could be more than only 1 term mapped to a spine term,
   * this method will merge the desired property among all the mapped term
   * properties. It is, the property attributes of each mapped term.
   *
   * It's usually only 1, but there may be cases when more than 1 term is mapped
   * to a spine term.
   *
   * @param {String} propertyName The name of the property to look after
   */
  printMappedProperty = (propertyName) => {
    const { alignment } = this.props;

    return alignment.mappedTerms
      .reduce((a, b) => a + (b.property[propertyName] + ', '), '')
      .slice(0, -2);
  };

  render() {
    /**
     * Elements from props
     */
    const { alignment } = this.props;
    /**
     * Elements from state
     */
    const { showingAlignmentComment } = this.state;

    return (
      <div className="card borderless mb-3">
        <div className="card-header desm-rounded bottom-borderless bg-col-secondary">
          <div className="row">
            <div className="col-2">
              <small className="mt-3 col-on-primary-light">Organization</small>
              <h5>{alignment.origin}</h5>

              <small className="mt-3 col-on-primary-light">Schema</small>
              <h5>{alignment.mappedTerms[0].property.scheme}</h5>
            </div>
            <div className="col-2">
              <small className="mt-3 col-on-primary-light">Element/Property</small>
              <h5>{this.printMappedTermProperty('name')}</h5>

              <small className="mt-3 col-on-primary-light">Class/Type</small>
              <h5>{alignment.mappedTerms[0].property.selectedDomain}</h5>
            </div>
            <div className="col-6">
              <small className="mt-3 col-on-primary-light">Definition</small>
              <h5>{this.printMappedProperty('comment')}</h5>
            </div>
            <div className="col-2">
              <div className="card borderless">
                <div
                  className="card-hader text-center desm-rounded p-3"
                  style={{
                    backgroundColor: alignment.predicate.color || 'unset',
                    color: alignment.predicate.color ? 'White' : 'DarkSlateGrey',
                  }}
                >
                  <strong>{alignment.predicate ? alignment.predicate.prefLabel : ''}</strong>
                </div>
              </div>
              {alignment.comment && (
                <label
                  className="non-selectable float-right mt-3 col-primary cursor-pointer"
                  onClick={() =>
                    this.setState({
                      showingAlignmentComment: !showingAlignmentComment,
                    })
                  }
                >
                  {showingAlignmentComment ? 'Hide Alignment Notes' : 'Alignment Notes'}
                </label>
              )}
            </div>
          </div>

          {showingAlignmentComment && (
            <div className="row">
              <div className="col">
                <div className="card borderless">
                  <div className="card-body">
                    <h6 className="col-on-primary">Alingment Note</h6>
                    {alignment.comment}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
