import { Component } from 'react';
import AlertNotice from '../shared/AlertNotice';
import fetchAlignmentsForSpine from '../../services/fetchAlignmentsForSpine';
import fetchDomain from '../../services/fetchDomain';
import fetchSpineTerms from '../../services/fetchSpineTerms';
import Loader from '../shared/Loader';
import NoSpineAlert from './NoSpineAlert';
import PropertyAlignments from './PropertyAlignments';
import PropertyCard from './PropertyCard';
import { implementSpineSort } from './SortOptions';

/**
 * @description: The list of properties with its alignments. Contains all the information about the property
 * itself, and the alginment, like the origin, the predicate, and more
 *
 * Props:
 * @param {Boolean} hideSpineTermsWithNoAlignments
 * @param {String} inputValue
 * @param {Array} organizations
 * @param {Object} selectedDomain
 * @param {String} selectedAlignmentOrderOption
 * @param {Array} selectedAlignmentOrganizations
 * @param {Array} selectedPredicates
 * @param {String} selectedSpineOrderOption
 * @param {Array} selectedSpineOrganizations
 */
export default class PropertiesList extends Component {
  /**
   * Representation of the state of this component
   */
  state = {
    /**
     * Representation of an errors on this page process
     */
    errors: [],
    /**
     * Whether the page is loading results or not
     */
    loading: true,
    /**
     * Whether there's a spine specification defined for the current selected domain
     */
    spineExists: false,
    /**
     * List of properties being shown
     */
    properties: [],
  };

  /**
   * Determines whether the alignments for a spine term are present or not.
   * Since alignment objects are proportional to the spine terms in number, we need to look
   * inside the aligments to the mapped terms. If none, it will be empty.
   *
   * @param {Array} alignments
   */
  alignmentsExists = (alignments) => {
    return alignments.some((alignment) => !_.isEmpty(alignment.mappedTerms));
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
   * Returns the list of properties filtered by the value the user typed in the searchbar
   */
  filteredProperties = () => {
    const { inputValue, hideSpineTermsWithNoAlignments, selectedSpineOrderOption } = this.props;
    const { properties } = this.state;

    let filteredProps = properties.filter(
      (property) =>
        /// Filter by the search input value
        property.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        /// Do not hide if checkbox not selected
        (!hideSpineTermsWithNoAlignments ||
          /// It has alignments
          (this.alignmentsExists(property.alignments) &&
            /// It matches the selected predicates
            property.alignments.some((alignment) =>
              this.selectedPredicateIds().includes(alignment.predicateId)
            ) &&
            /// It matches the selected alignment organizations
            property.alignments.some((alignment) =>
              alignment.mappedTerms.some((mTerm) =>
                this.selectedAlignmentOrganizationIds().includes(mTerm.organization?.id)
              )
            ) &&
            /// It matches the selected spine organizations
            this.selectedSpineOrganizationIds().includes(property.organizationId)))
    );

    return implementSpineSort(filteredProps, selectedSpineOrderOption);
  };

  /**
   * Handle showing the errors on screen, if any
   *
   * @param {HttpResponse} response
   */
  anyError(response) {
    if (response.error) {
      this.setState({ errors: [...this.state.errors, response.error] });
    }
    /// It will return a truthy value (depending no the existence
    /// of the error on the response object)
    return !_.isUndefined(response.error);
  }

  /**
   * Use the service to fetch information about the selected domain
   */
  handleFetchDomain = async () => {
    const { selectedDomain } = this.props;

    let response = await fetchDomain(selectedDomain.id);

    if (!this.anyError(response)) {
      if (!response.domain['spine?']) {
        this.setState({ spineExists: false });
        return false;
      }

      this.setState({ spineExists: true });
      return response;
    }
  };

  /**
   * Handles to inlcude the alignments inside each property object.
   * This way we have the control onto show or hide the spine terms with no
   * alignments.
   *
   * @param {number} spineId
   */
  decoratePropertiesWithAlignments = async (spineId, spineTerms) => {
    const response = await fetchAlignmentsForSpine(spineId);

    if (!this.anyError(response)) {
      const { alignments } = response;
      const groupedAlignments = _.groupBy(alignments, 'spineTermId');

      spineTerms.forEach((term) => (term.alignments = groupedAlignments[term.id] || []));
    }

    return spineTerms;
  };

  /**
   * Use the service to get all the available properties of a spine specification
   */
  handleFetchProperties = async (spineId) => {
    let response = await fetchSpineTerms(spineId);

    if (!this.anyError(response)) {
      const properties = await this.decoratePropertiesWithAlignments(spineId, response.terms);

      this.setState({ properties });
    }
  };

  /**
   * Fetch all the necessary data from the API
   */
  handleFetchDataFromAPI = async () => {
    let response = await this.handleFetchDomain();

    if (!this.anyError(response) && this.state.spineExists) {
      await this.handleFetchProperties(response.domain.spine.id);
    }
  };

  /**
   * Use the service to get all the necessary data
   */
  fetchData = () => {
    const { errors } = this.state;
    this.setState({ loading: true });

    this.handleFetchDataFromAPI().then(() => {
      if (!errors.length) {
        this.setState({ loading: false });
      }
    });
  };

  /**
   * Set the alignment score from the calculation when its done
   *
   * @param {Object} property
   * @param {Float} score
   */
  handleAlignmentScoreFetched = (property, score) => {
    const { properties } = this.state;
    property.alignmentScore = score;

    this.setState({ properties: [...properties] });
  };

  /**
   * Tasks when the component updates itself
   */
  componentDidUpdate(prevProps) {
    if (this.props.selectedDomain !== prevProps.selectedDomain) {
      this.fetchData();
    }
  }

  /**
   * Tasks when the component mount
   */
  componentDidMount() {
    this.fetchData();
  }

  render() {
    /**
     * Elements from state
     */
    const { errors, spineExists, loading } = this.state;

    /**
     * Elements from props
     */
    const {
      predicates,
      organizations,
      selectedAlignmentOrderOption,
      selectedAlignmentOrganizations,
      selectedDomain,
      selectedPredicates,
      selectedSpineOrganizations,
    } = this.props;

    return loading ? (
      <Loader />
    ) : errors.length ? (
      /* ERRORS */
      <AlertNotice message={errors} onClose={() => this.setState({ errors: [] })} />
    ) : spineExists ? (
      this.filteredProperties().map((term) => {
        return (
          <div className="row mt-3" key={term.id}>
            <div className="col-4 pb-3">
              <PropertyCard
                organizations={organizations}
                predicates={predicates}
                selectedDomain={selectedDomain}
                term={term}
                onAlignmentScoreFetched={(score) => this.handleAlignmentScoreFetched(term, score)}
              />
            </div>
            <div className="col-8">
              <PropertyAlignments
                selectedAlignmentOrderOption={selectedAlignmentOrderOption}
                selectedAlignmentOrganizations={selectedAlignmentOrganizations}
                selectedPredicates={selectedPredicates}
                selectedSpineOrganizations={selectedSpineOrganizations}
                spineTerm={term}
              />
            </div>
          </div>
        );
      })
    ) : (
      <NoSpineAlert />
    );
  }
}
