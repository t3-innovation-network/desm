import { Component } from 'react';
import { flatMap, groupBy, intersection, sortBy, uniqBy } from 'lodash';
import AlertNotice from '../shared/AlertNotice';
import fetchAlignmentsForSpine from '../../services/fetchAlignmentsForSpine';
import fetchSpineTerms from '../../services/fetchSpineTerms';
import Loader from '../shared/Loader';
import NoSpineAlert from './NoSpineAlert';
import PropertyAlignments from './PropertyAlignments';
import PropertyCard from './PropertyCard';
import { implementSpineSort } from './SortOptions';
import { i18n } from 'utils/i18n';
import { dateLongFormat } from 'utils/dateFormatting';

/**
 * @description: The list of properties with its alignments. Contains all the information about the property
 * itself, and the alginment, like the origin, the predicate, and more
 *
 * Props:
 * @param {Boolean} hideSpineTermsWithNoAlignments
 * @param {Object} configurationProfile
 * @param {String} inputValue
 * @param {Array} specifications
 * @param {Object} selectedDomain
 * @param {String} selectedAlignmentOrderOption
 * @param {Array} selectedAlignmentSpecifications
 * @param {Array} selectedPredicates
 * @param {String} selectedSpineOrderOption
 * @param {Array} selectedSpineSpecifications
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

  // TODO: this need to be moved to top level store
  /**
   * The list of ids for the selected predicates
   */
  selectedPredicateIds = () => this.props.selectedPredicates.map((predicate) => predicate.id);

  /**
   * The list of ids for the selected alignment specifications
   */
  selectedAlignmentSpecificationsIds = () =>
    this.props.selectedAlignmentSpecifications.map((s) => s.id);

  /**
   * The list of ids for the selected spine specifications
   */
  selectedSpineSpecificationIds = () => this.props.selectedSpineSpecifications.map((s) => s.id);

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
            /// It matches the selected alignment specifications
            property.alignments.some((alignment) =>
              this.selectedAlignmentSpecificationsIds().includes(alignment.mapping.specification.id)
            ) &&
            /// It matches the selected spine specifications
            intersection(
              this.selectedSpineSpecificationIds(),
              property.specifications.map((s) => s.id)
            ).length))
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
   * Handles to inlcude the alignments inside each property object.
   * This way we have the control onto show or hide the spine terms with no
   * alignments.
   *
   * @param {number} spineId
   */
  decoratePropertiesWithAlignments = async (spineId, spineTerms) => {
    const response = await fetchAlignmentsForSpine({
      spineId,
      configurationProfileId: this.props.configurationProfile?.id,
    });

    if (!this.anyError(response)) {
      const { alignments } = response;
      const groupedAlignments = groupBy(alignments, 'spineTermId');

      spineTerms.forEach((term) => {
        term.alignments = groupedAlignments[term.id] || [];
        term.alignmentScore =
          term.maxMappingWeight > 0 ? (term.currentMappingWeight * 100) / term.maxMappingWeight : 0;
      });
    }

    return spineTerms;
  };

  /**
   * Use the service to get all the available properties of a spine specification
   */
  handleFetchProperties = async (spineId) => {
    let response = await fetchSpineTerms(spineId, {
      withWeights: true,
      configurationProfileId: this.props.configurationProfile?.id,
    });

    if (!this.anyError(response)) {
      const properties = await this.decoratePropertiesWithAlignments(spineId, response.terms);

      this.setState({ properties });
    }
  };

  /**
   * Fetch all the necessary data from the API
   */
  handleFetchDataFromAPI = async () => {
    const { selectedDomain } = this.props;
    this.setState({ spineExists: selectedDomain.spine });

    if (selectedDomain.spine) {
      await this.handleFetchProperties(selectedDomain.spineId);
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
    const { selectedAlignmentOrderOption } = this.props;

    const filteredPropertiesList = () =>
      this.filteredProperties().map((term) => {
        return (
          <div className="row mt-4" key={term.id}>
            <div className="col-4">
              <PropertyCard term={term} />
            </div>
            <div className="col-8">
              <PropertyAlignments
                selectedAlignmentOrderOption={selectedAlignmentOrderOption}
                selectedAlignmentSpecificationsIds={this.selectedAlignmentSpecificationsIds()}
                selectedPredicateIds={this.selectedPredicateIds()}
                selectedSpineSpecificationIds={this.selectedSpineSpecificationIds()}
                spineTerm={term}
              />
            </div>
          </div>
        );
      });

    const filteredMappingsList = () => {
      const mappings = uniqBy(
        flatMap(this.filteredProperties(), (term) => term.alignments.map((a) => a.mapping)),
        'id'
      );

      const groupedMappings = {};

      for (const mapping of mappings) {
        const lastMapping = groupedMappings[mapping.specification.name];

        if (!lastMapping || lastMapping.mappedAt < mapping.mappedAt) {
          groupedMappings[mapping.specification.name] = mapping;
        }
      }

      const lastMappings = sortBy(Object.values(groupedMappings), 'specification.name');

      return (
        <>
          <h5 className="mb-0 mt-3">
            {i18n.t('ui.view_mapping.mapping', { count: mappings.length })}
          </h5>
          <ul className="list-unstyled mb-0">
            {lastMappings.map((mapping) => (
              <li key={mapping.id}>
                <span className="fw-bold">
                  {mapping.specification.name} {mapping.version ? `(${mapping.version})` : ''}
                </span>{' '}
                updated on {dateLongFormat(mapping.updatedAt)}.
              </li>
            ))}
          </ul>
        </>
      );
    };

    return loading ? (
      <Loader />
    ) : errors.length ? (
      /* ERRORS */
      <AlertNotice message={errors} onClose={() => this.setState({ errors: [] })} />
    ) : spineExists ? (
      <>
        {filteredMappingsList()}
        {filteredPropertiesList()}
      </>
    ) : (
      <NoSpineAlert />
    );
  }
}
