import { Component } from 'react';
import fetchDomains from '../../services/fetchDomains';
import fetchOrganizations from '../../services/fetchOrganizations';
import fetchPredicates from '../../services/fetchPredicates';
import AlertNotice from '../shared/AlertNotice';
import Loader from '../shared/Loader';
import TopNav from '../shared/TopNav';
import TopNavOptions from '../shared/TopNavOptions';
import DesmTabs from '../shared/DesmTabs';
import PropertiesList from './PropertiesList';
import PropertyMappingsFilter from './PropertyMappingsFilter';
import SearchBar from './SearchBar';
import queryString from 'query-string';
import { alignmentSortOptions, spineSortOptions } from './SortOptions';
import ConfigurationProfileSelect from '../shared/ConfigurationProfileSelect';
import { AppContext } from '../../contexts/AppContext';

export default class PropertyMappingList extends Component {
  static contextType = AppContext;

  state = {
    /**
     * The list of available domains
     */
    domains: [],
    /**
     * Representation of an error on this page process
     */
    errors: [],
    /**
     * Flag to determine whether to show or not the spine terms with no mapped terms
     */
    hideSpineTermsWithNoAlignments: false,
    /**
     * Whether the page is loading results or not
     */
    loading: false,
    /**
     * The available list of organizations
     */
    organizations: [],
    /**
     * The complete list of available predicates
     */
    predicates: [],
    /**
     * The value from the input in the searchbar, to filter properties
     */
    propertiesInputValue: '',
    /**
     * The currently selected organizations to fetch alignments from
     */
    selectedAlignmentOrganizations: [],
    /**
     * The currently selected domain
     */
    selectedDomain: null,
    /**
     * The organizations to show in the filter
     */
    selectedSpineOrganizations: [],
    /**
     * The predicates the user selected to use in filter
     */
    selectedPredicates: [],
    /**
     * The order the user wants to see the alignments to the spine terms
     */
    selectedAlignmentOrderOption: alignmentSortOptions.ORGANIZATION,
    /**
     * The order the user wants to see the spine terms
     */
    selectedSpineOrderOption: spineSortOptions.OVERALL_ALIGNMENT_SCORE,
  };

  /**
   * Configure the options to see at the center of the top navigation bar
   */
  navCenterOptions = () => {
    return <TopNavOptions viewMappings={true} mapSpecification={true} />;
  };

  /**
   * Set the new (changed from a child component) list of spine organizations selected
   * by the user.
   *
   * @param {Array} orgs
   */
  handleSpineOrganizationSelected = (orgs) => {
    this.setState({ selectedSpineOrganizations: orgs });
  };

  /**
   * Set the new (changed from a child component) list of spine organizations selected
   * by the user.
   *
   * @param {Array} orgs
   */
  handleAlignmentOrganizationSelected = (orgs) => {
    this.setState({ selectedAlignmentOrganizations: orgs });
  };

  /**
   * Set the new (changed from a child component) list of predicates selected
   * by the user.
   *
   * @param {Array} sPredicates
   */
  handlePredicateSelected = (sPredicates) => {
    this.setState({ selectedPredicates: sPredicates });
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
   * Use the service to get all the available domains
   */
  handleFetchDomains = async () => {
    const response = await fetchDomains();
    const { domains } = response;

    if (!this.anyError(response)) {
      this.setState({ domains, selectedDomain: domains[0] });
    }
  };

  /**
   * Use the service to get all the available organizations
   */
  handleFetchOrganizations = async () => {
    let response = await fetchOrganizations();

    if (!this.anyError(response)) {
      this.setState({
        organizations: response.organizations,
        selectedSpineOrganizations: response.organizations,
        selectedAlignmentOrganizations: response.organizations,
      });
    }
  };

  /**
   * Use the service to get all the available predicates
   */
  handleFetchPredicates = async () => {
    let response = await fetchPredicates();

    if (!this.anyError(response)) {
      this.setState({
        predicates: response.predicates,
        selectedPredicates: response.predicates,
      });
    }
  };

  /**
   * Fetch all the necessary data from the API
   */
  handleFetchDataFromAPI = async () => {
    await this.handleFetchDomains();
    await this.handleFetchOrganizations();
    await this.handleFetchPredicates();
  };

  /**
   * Manages to set the domain to show in the UI if there's a correct domain selected in the URL parameters
   */
  setSelectedDomain = () => {
    const { domains } = this.state;

    /// Get the abstract class name from the query string URL parameters
    var selectedAbstractClassName = queryString.parse(this.props.location.search).abstractClass;

    if (selectedAbstractClassName) {
      /// Find the selected domain from the list of domains, searching by name.
      let selectedAbstractClass = domains.find(
        (d) => d.name.toLowerCase() == selectedAbstractClassName.toLowerCase()
      );

      if (selectedAbstractClass) {
        /// Update the UI to show directly that domain alignments
        this.setState({ selectedDomain: selectedAbstractClass });
      }
    }
  };

  /**
   * Tasks before mount
   */
  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    if (!this.context.currentConfigurationProfile) {
      return;
    }

    const { errors } = this.state;

    this.setState({ loading: true });

    await this.handleFetchDataFromAPI();

    if (!errors.length) {
      this.setSelectedDomain();
      this.setState({ loading: false });
    }
  }

  render() {
    /**
     * Elements from state
     */
    const {
      domains,
      errors,
      hideSpineTermsWithNoAlignments,
      loading,
      organizations,
      predicates,
      propertiesInputValue,
      selectedAlignmentOrderOption,
      selectedAlignmentOrganizations,
      selectedDomain,
      selectedPredicates,
      selectedSpineOrderOption,
      selectedSpineOrganizations,
    } = this.state;

    return (
      <div className="container-fluid">
        <TopNav centerContent={this.navCenterOptions} />
        {/* ERRORS */}
        {errors.length ? (
          <AlertNotice message={errors} onClose={() => this.setState({ errors: [] })} />
        ) : (
          ''
        )}

        <div className="row">
          <div className="col p-lg-5 pt-5">
            {!this.context.loggedIn && (
              <ConfigurationProfileSelect onChange={this.loadData.bind(this)} />
            )}

            {this.context.currentConfigurationProfile &&
              (loading ? (
                <Loader />
              ) : (
                <>
                  <h1>Synthetic Spine Property Mapping By Category</h1>

                  <DesmTabs
                    onTabClick={(id) => {
                      this.setState({
                        selectedDomain: domains.find((domain) => domain.id == id),
                      });
                    }}
                    selectedId={selectedDomain?.id}
                    values={domains}
                  />
                  <SearchBar
                    onAlignmentOrderChange={(option) =>
                      this.setState({ selectedAlignmentOrderOption: option })
                    }
                    onHideSpineTermsWithNoAlignmentsChange={(val) => {
                      this.setState({
                        hideSpineTermsWithNoAlignments: val,
                      });
                    }}
                    onSpineOrderChange={(option) =>
                      this.setState({ selectedSpineOrderOption: option })
                    }
                    onType={(val) => {
                      this.setState({ propertiesInputValue: val });
                    }}
                    selectedAlignmentOrderOption={selectedAlignmentOrderOption}
                    selectedSpineOrderOption={selectedSpineOrderOption}
                  />

                  {selectedDomain && (
                    <>
                      <PropertyMappingsFilter
                        organizations={organizations}
                        onAlignmentOrganizationSelected={(orgs) =>
                          this.handleAlignmentOrganizationSelected(orgs)
                        }
                        onPredicateSelected={(sPredicates) =>
                          this.handlePredicateSelected(sPredicates)
                        }
                        onSpineOrganizationSelected={(orgs) =>
                          this.handleSpineOrganizationSelected(orgs)
                        }
                        predicates={predicates}
                        selectedAlignmentOrderOption={selectedAlignmentOrderOption}
                        selectedAlignmentOrganizations={selectedAlignmentOrganizations}
                        selectedDomain={selectedDomain}
                        selectedPredicates={selectedPredicates}
                        selectedSpineOrderOption={selectedSpineOrderOption}
                        selectedSpineOrganizations={selectedSpineOrganizations}
                      />

                      <PropertiesList
                        hideSpineTermsWithNoAlignments={hideSpineTermsWithNoAlignments}
                        inputValue={propertiesInputValue}
                        organizations={organizations}
                        predicates={predicates}
                        selectedAlignmentOrderOption={selectedAlignmentOrderOption}
                        selectedAlignmentOrganizations={selectedAlignmentOrganizations}
                        selectedDomain={selectedDomain}
                        selectedPredicates={selectedPredicates}
                        selectedSpineOrderOption={selectedSpineOrderOption}
                        selectedSpineOrganizations={selectedSpineOrganizations}
                      />
                    </>
                  )}
                </>
              ))}
          </div>
        </div>
      </div>
    );
  }
}
