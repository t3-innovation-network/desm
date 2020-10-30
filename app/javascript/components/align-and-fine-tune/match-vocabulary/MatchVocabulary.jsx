import React, { Component, Fragment } from "react";
import Modal from "react-modal";
import fetchVocabulary from "../../../services/fetchVocabulary";
import AlertNotice from "../../shared/AlertNotice";
import Loader from "../../shared/Loader";
import ModalStyles from "../../shared/ModalStyles";
import HeaderContent from "./HeaderContent";
import MappingConceptsList from "./MappingConceptsList";
import SpineConceptRow from "./SpineConceptRow";

/**
 * Props
 * @param {Function} onRequestClose
 * @param {Boolean} modalIsOpen
 * @param {String} spineOrigin
 * @param {String} mappingOrigin
 * @param {Object} mappedTerm
 * @param {Object} spineTerm
 * @param {Array} predicates
 */
export default class MatchVocabulary extends Component {
  /**
   * State of the component
   */
  state = {
    /**
     * Whether the page is loading results or not
     */
    loading: true,
    /**
     * Manage the errors on this screen
     */
    errors: [],
    /**
     * The vocabulary concepts for the spine term
     */
    spineConcepts: [],
    /**
     * The vocabulary concepts for the mapped term
     */
    mappingConcepts: [],
  };

  /**
   * The mapping vocabulary concepts, filtered by selected/not selected.
   */
  filteredMappingConcepts = (options = { pickSelected: false }) =>
    this.state.mappingConcepts
      .filter((concept) => {
        return options.pickSelected ? concept.selected : !concept.selected;
      })
      .sort((a, b) => (a.name > b.name ? 1 : -1));

  /**
   * Mark the term as "selected"
   */
  onMappingConceptClick = (clickedConcept) => {
    const { mappingConcepts } = this.state;
    let concept = mappingConcepts.find((c) => c.id == clickedConcept.id);
    concept.selected = !concept.selected;

    this.setState({ mappingConcepts: mappingConcepts });
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
    /// of the errors on the response object)
    return !_.isUndefined(response.error);
  }

  /**
   * Get the spine vocabulary
   */
  handleFetchSpineVocabulary = async () => {
    const { spineTerm } = this.props;

    let response = await fetchVocabulary(spineTerm.vocabularies[0].id);

    if (!this.anyError(response)) {
      // Set the spine vocabulary concepts on state
      this.setState({ spineConcepts: response.vocabulary.concepts });
    }
  };

  /**
   * Get the spine vocabulary
   */
  handleFetchMappedTermVocabulary = async () => {
    const { mappedTerm } = this.props;

    let response = await fetchVocabulary(mappedTerm.vocabularies[0].id);

    if (!this.anyError(response)) {
      // Set the mapping vocabulary concepts on state
      this.setState({ mappingConcepts: response.vocabulary.concepts });
    }
  };

  /**
   * Actions to take when a predicate has been selected for a mapping term
   *
   * @param {Object} predicate
   */
  handlePredicateSelected = (concept, predicate) => {
    // @todo: logic when a predicate is selected. The alginment vocabulary concept
    //   is matched with the selected predicate in memory
  };

  /**
   * Get the data from the service
   */
  fetchDataFromAPI = async () => {
    // Get the spine vocabulary
    await this.handleFetchSpineVocabulary();
    // Get the mapped term vocabulary
    await this.handleFetchMappedTermVocabulary();
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'fetchDataFromAPI'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  componentDidMount = async () => {
    const { errors } = this.state;

    Modal.setAppElement("body");

    this.setState({ loading: true });
    await this.fetchDataFromAPI().then(() => {
      if (_.isEmpty(errors)) {
        this.setState({ loading: false });
      }
    });
  };

  render() {
    const {
      modalIsOpen,
      onRequestClose,
      mappingOrigin,
      spineOrigin,
      predicates,
    } = this.props;

    const { loading, errors, spineConcepts } = this.state;

    /**
     * Structure for the title
     */
    const Title = () => {
      return (
        <div className="row mb-3">
          <div className="col-6">
            <h4>T3 Spine</h4>
          </div>
          <div className="col-3">
            <h4>{mappingOrigin}</h4>
          </div>
          <div className="col-3">
            <div className="float-right">
              {this.filteredMappingConcepts({ pickSelected: true }).length +
                " elements selected"}
            </div>
          </div>
        </div>
      );
    };

    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={onRequestClose}
        contentLabel="Match Controlled Vocabulary"
        style={ModalStyles}
        shouldCloseOnEsc={false}
        shouldCloseOnOverlayClick={false}
      >
        <div className="card p-5">
          <div className="card-header no-color-header border-bottom pb-3">
            <HeaderContent onClose={onRequestClose} />
          </div>
          <div className="card-body">
            {errors.length ? <AlertNotice message={errors.join("\n")} /> : ""}
            {loading ? (
              <Loader />
            ) : (
              <Fragment>
                <Title />

                <div className="row">
                  <div className="col-8">
                    {spineConcepts.map((concept) => {
                      return (
                        <SpineConceptRow
                          concept={concept}
                          spineOrigin={spineOrigin}
                          predicates={predicates}
                          handlePredicateSelected={this.handlePredicateSelected}
                          selectedCount={
                            this.filteredMappingConcepts({ pickSelected: true })
                              .length
                          }
                        />
                      );
                    })}
                  </div>
                  <div className="col-4 bg-col-secondary">
                    <MappingConceptsList
                      mappingOrigin={mappingOrigin}
                      filteredMappingConcepts={this.filteredMappingConcepts}
                      onMappingConceptClick={this.onMappingConceptClick}
                    />
                  </div>
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </Modal>
    );
  }
}
