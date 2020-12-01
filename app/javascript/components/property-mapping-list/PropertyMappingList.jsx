import React, { Component } from "react";
import fetchDomains from "../../services/fetchDomains";
import fetchOrganizations from "../../services/fetchOrganizations";
import fetchPredicates from "../../services/fetchPredicates";
import AlertNotice from "../shared/AlertNotice";
import Loader from "../shared/Loader";
import TopNav from "../shared/TopNav";
import TopNavOptions from "../shared/TopNavOptions";
import DesmTabs from "../shared/DesmTabs";
import PropertiesList from "./PropertiesList";
import PropertyMappingsFilter from "./PropertyMappingsFilter";
import SearchBar from "./SearchBar";

export default class PropertyMappingList extends Component {
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
     * Whether the page is loading results or not
     */
    loading: true,
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
    propertiesInputValue: "",
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
      let tempErrors = errors;
      tempErrors.push(response.error);
      this.setState({ errors: tempErrors });
    }
    /// It will return a truthy value (depending no the existence
    /// of the error on the response object)
    return !_.isUndefined(response.error);
  }

  /**
   * Use the service to get all the available domains
   */
  handleFetchDomains = async () => {
    let response = await fetchDomains();

    if (!this.anyError(response)) {
      this.setState({
        domains: response.domains,
        selectedDomain: response.domains[0],
      });
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
        selectedPredicates: [response.predicates[0]],
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
   * Tasks before mount
   */
  componentDidMount() {
    const { errors } = this.state;

    this.handleFetchDataFromAPI().then(() => {
      if (!errors.length) {
        this.setState({ loading: false });
      }
    });
  }

  render() {
    /**
     * Elements from state
     */
    const {
      domains,
      errors,
      loading,
      organizations,
      predicates,
      propertiesInputValue,
      selectedAlignmentOrganizations,
      selectedDomain,
      selectedPredicates,
      selectedSpineOrganizations,
    } = this.state;

    return (
      <div className="wrapper">
        <TopNav centerContent={this.navCenterOptions} />
        {/* ERRORS */}
        {errors.length ? <AlertNotice message={errors} /> : ""}

        <div className="container-fluid container-wrapper">
          <div className="row">
            {loading ? (
              <Loader />
            ) : (
              <div className="col p-lg-5 pt-5">
                <h1>Synthetic Spine Property Mapping By Category</h1>

                <DesmTabs
                  values={domains}
                  selectedId={selectedDomain && selectedDomain.id}
                  onTabClick={(id) => {
                    this.setState({
                      selectedDomain: domains.find((domain) => domain.id == id),
                    });
                  }}
                />
                <SearchBar
                  onType={(val) => {
                    this.setState({ propertiesInputValue: val });
                  }}
                />

                <PropertyMappingsFilter
                  organizations={organizations}
                  selectedAlignmentOrganizations={
                    selectedAlignmentOrganizations
                  }
                  selectedDomain={selectedDomain}
                  selectedSpineOrganizations={selectedSpineOrganizations}
                  predicates={predicates}
                  selectedPredicates={selectedPredicates}
                  onSpineOrganizationSelected={(orgs) =>
                    this.handleSpineOrganizationSelected(orgs)
                  }
                  onAlignmentOrganizationSelected={(orgs) =>
                    this.handleAlignmentOrganizationSelected(orgs)
                  }
                  onPredicateSelected={(sPredicates) =>
                    this.handlePredicateSelected(sPredicates)
                  }
                />

                <PropertiesList
                  selectedDomain={selectedDomain}
                  selectedAlignmentOrganizations={
                    selectedAlignmentOrganizations
                  }
                  selectedPredicates={selectedPredicates}
                  selectedSpineOrganizations={selectedSpineOrganizations}
                  organizations={organizations}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
