import React, { Component } from "react";
import fetchDomain from "../../services/fetchDomain";
import fetchSpecificationTerms from "../../services/fetchSpecificationTerms";
import Loader from "../shared/Loader";
import NoSpineAlert from "./NoSpineAlert";
import PropertyAlignments from "./PropertyAlignments";
import PropertyCard from "./PropertyCard";

/**
 * @description: The list of properties with its alignments. Contains all the information about the property
 * itself, and the alginment, like the origin, the predicate, and more
 *
 * Props:
 * @param {Array} organizations
 * @param {Object} selectedDomain
 * @param {Array} selectedAlignmentOrganizations
 * @param {Array} selectedPredicates
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
    spineExists: true,
    /**
     * List of properties being shown
     */
    properties: [],
  };

  /**
   * Handle showing the errors on screen, if any
   *
   * @param {HttpResponse} response
   */
  anyError(response) {
    const { errors } = this.state;

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
   * Use the service to fetch information about the selected domain
   */
  handleFetchDomain = async () => {
    const { selectedDomain } = this.props;

    let response = await fetchDomain(selectedDomain.id);

    if (!this.anyError(response)) {
      if (!response.domain.spineId) {
        this.setState({ spineExists: false });
        return false;
      }

      this.setState({ spineExists: true });
      return response;
    }
  };

  /**
   * Use the service to get all the available properties of a spine specification
   */
  handleFetchProperties = async (specId) => {
    let response = await fetchSpecificationTerms(specId);

    if (!this.anyError(response)) {
      this.setState({
        properties: response.terms,
      });
    }
  };

  /**
   * Fetch all the necessary data from the API
   */
  handleFetchDataFromAPI = async () => {
    let response = await this.handleFetchDomain();

    if (response) {
      await this.handleFetchProperties(response.domain.spineId);
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
    const { errors, properties, spineExists, loading } = this.state;

    /**
     * Elements from props
     */
    const { predicates, organizations, selectedDomain } = this.props;

    return loading ? (
      <Loader />
    ) : errors.length ? (
      /* ERRORS */
      <AlertNotice message={errors} />
    ) : spineExists ? (
      properties.map((term) => {
        return (
          <div className="row mt-3" key={term.id}>
            <div className="col-4">
              <PropertyCard
                organizations={organizations}
                predicates={predicates}
                selectedDomain={selectedDomain}
                term={term}
              />
            </div>
            <div className="col-8">
              <PropertyAlignments spineTerm={term} />
            </div>
          </div>
        );
      })
    ) : (
      <NoSpineAlert />
    );
  }
}
