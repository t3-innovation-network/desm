import React, { Component, Fragment } from "react";
import Modal from "react-modal";
import fetchAlginmentVocabulary from "../../../services/fetchAlignmentVocabulary";
import fetchVocabularyConcepts from "../../../services/fetchVocabularyConcepts";
import updateAlignmentVocabularyConcept from "../../../services/updateAlignmentVocabularyConcept";
import AlertNotice from "../../shared/AlertNotice";
import Loader from "../../shared/Loader";
import ModalStyles from "../../shared/ModalStyles";
import HeaderContent from "./HeaderContent";
import MappingConceptsList from "./MappingConceptsList";
import SpineConceptRow from "./SpineConceptRow";
import { toastr as toast } from "react-redux-toastr";
import createSyntheticVocabularyConcept from "../../../services/createSyntheticVocabularyConcept";

/**
 * Props
 * @param {Function} onRequestClose
 * @param {Boolean} modalIsOpen
 * @param {String} spineOrigin
 * @param {String} mappingOrigin
 * @param {Object} mappedTerm
 * @param {Object} mappingTerm
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
    /**
     * The vocabulary concepts for the mapped term
     */
    alignmentConcepts: [],
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
   * The changed alignments
   */
  changedAlignments = () =>
    this.state.alignmentConcepts.filter((alignment) => alignment.updated);

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
   * Actions to take when a predicate has been selected for a mapping term
   * The alginment vocabulary concept is matched with the selected predicate in memory
   *
   * @param {Object} predicate
   */
  handleOnPredicateSelected = (concept, predicate) => {
    const { alignmentConcepts } = this.state;

    let alignment = alignmentConcepts.find(
      (conc) => conc.spine_concept_id === concept.id
    );
    alignment.predicate_id = predicate.id;
    alignment.updated = true;

    this.setState({ alignmentConcepts: alignmentConcepts });
  };

  /**
   * Actions to perform when concepts were dropped into a synthetic alignment (No Match)
   *
   * @param {Object} alignment
   */
  handleDropOnSynthetic = (alignment) => {
    const { spineConcepts } = this.state;

    /// Instantiate the spine concept
    let spineConcept = spineConcepts.find(
      (concept) => concept.id == alignment.spine_concept_id
    );

    /// Name the synthetic spine concept
    let [mappedConcept] = alignment.mapped_concepts;
    spineConcept.name = mappedConcept.name;

    /// Add a new synthetic row
    this.addSyntheticConceptRow();
  };

  /**
   * Actions when a concept or set of concepts are dropped into an alignment
   *
   * @param {Object} alignment
   * @param {Object} concept
   */
  handleAfterDropConcept = (spineData) => {
    const { alignmentConcepts, mappingConcepts } = this.state;

    /// Get the alignment (information about vocabulary being mapped)
    let alignment = alignmentConcepts.find(
      (conc) => conc.spine_concept_id == spineData.spineConceptId
    );

    /// Update the mapped concepts
    alignment.mapped_concepts = this.filteredMappingConcepts({
      pickSelected: true,
    });

    alignment.updated = true;

    if (alignment.synthetic) {
      this.handleDropOnSynthetic(alignment);
    }

    /// Deselect the selected concepts
    this.filteredMappingConcepts({ pickSelected: true }).forEach(
      (conc) => (conc.selected = false)
    );

    /// Update the UI
    this.setState({ alignmentConcepts: alignmentConcepts });
    this.setState({ mappingConcepts: mappingConcepts });
  };

  /**
   * Add a new synthetic concept row. This, in order to be able to map
   * a concept as "No Match".
   */
  addSyntheticConceptRow = () => {
    const { alignmentConcepts, spineConcepts } = this.state;
    const { predicates } = this.props;

    let nextSpineConceptId = _.maxBy(spineConcepts, "id").id + 1;
    let nextAlignmentId = _.maxBy(alignmentConcepts, "id").id + 1;

    // Add a synthetic concept to have the chance to match elements to
    // the "No Match" predicate option.
    spineConcepts.push({
      id: nextSpineConceptId,
      name: "",
      definition: "Synthetic element added to the vocabulary",
      synthetic: true,
    });

    // Add the corresponding synthetic alignment
    alignmentConcepts.push({
      id: nextAlignmentId,
      predicate_id: predicates.find((predicate) =>
        predicate.uri.toLowerCase().includes("nomatch")
      ).id,
      spine_concept_id: nextSpineConceptId,
      synthetic: true,
    });

    this.setState({
      spineConcepts: spineConcepts,
      alignmentConcepts: alignmentConcepts,
    });
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
   * Save all those alignments marked as "updated"
   */
  saveChangedAlignments = () => {
    this.changedAlignments()
      .filter((a) => !a.synthetic)
      .forEach((alignment) => {
        let response = updateAlignmentVocabularyConcept({
          id: alignment.id,
          predicate_id: alignment.predicate_id,
          mapped_concepts: alignment.mapped_concepts.map(
            (concept) => concept.id
          ),
        });

        // Stop the execution on any error. The details will be shown on the screen by AlertNotice
        if (this.anyError(response)) {
          return;
        }
      });
  };

  /**
   * Save all those alignments added mannually
   */
  saveSyntheticAlignments = () => {
    const { spineConcepts } = this.state;

    this.changedAlignments()
      .filter((a) => a.synthetic)
      .forEach((alignment) => {
        let spineConcept = spineConcepts.find(
          (sc) => sc.id == alignment.spine_concept_id
        );
        let response = createSyntheticVocabularyConcept({
          spine_concept: {
            uri: "http://desm.org/concepts/concepts/" + spineConcept.name,
            raw: {
              id: "http://desm.org/concepts/concepts" + spineConcept.name,
              type: "skos:Concept",
              prefLabel: {
                "en-us": spineConcept.name,
              },
              definition: {
                "en-us":
                  "Synthetic concept added to the vocabulary for " +
                  spineConcept.name,
              },
              inScheme: "http://desm.org/concepts/mappingClasses",
            },
          },
          alignment: {
            predicate_id: 7,
            alignment_vocabulary_id: 1,
            mapped_concepts: alignment.mapped_concepts,
          },
        });

        // Stop the execution on any error. The details will be shown on the screen by AlertNotice
        if (this.anyError(response)) {
          return;
        }
      });
  };

  /**
   * Saves the alginment changes
   */
  handleSave = () => {
    const { onRequestClose } = this.props;

    this.saveChangedAlignments();
    this.saveSyntheticAlignments();

    toast.success("The vocabulary changes were successfully saved!");
    onRequestClose();
  };

  /**
   * Get the spine vocabulary
   */
  handleFetchSpineVocabulary = async () => {
    const { spineTerm } = this.props;

    let response = await fetchVocabularyConcepts(spineTerm.vocabularies[0].id);

    if (!this.anyError(response)) {
      // Set the spine vocabulary concepts on state
      this.setState({ spineConcepts: response });
    }
  };

  /**
   * Get the spine vocabulary
   */
  handleFetchMappedTermVocabulary = async () => {
    const { mappedTerm } = this.props;

    let response = await fetchVocabularyConcepts(mappedTerm.vocabularies[0].id);

    if (!this.anyError(response)) {
      // Set the mapping vocabulary concepts on state
      this.setState({ mappingConcepts: response });
    }
  };

  /**
   * Get the alignment vocabulary. This is the vocabulary for the
   */
  handleFetchAlignmentVocabulary = async () => {
    const { mappingTerm } = this.props;

    let response = await fetchAlginmentVocabulary(mappingTerm.id);

    if (!this.anyError(response)) {
      // Set the alignment vocabulary concepts on state
      this.setState({ alignmentConcepts: response });
    }
  };

  /**
   * Get the data from the service
   */
  fetchDataFromAPI = async () => {
    // Get the spine vocabulary
    await this.handleFetchSpineVocabulary();
    // Get the mapped term vocabulary
    await this.handleFetchMappedTermVocabulary();
    // Get the alignment term vocabulary
    await this.handleFetchAlignmentVocabulary();
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
        this.addSyntheticConceptRow();
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

    const { loading, errors, spineConcepts, alignmentConcepts } = this.state;

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
            <HeaderContent
              onRequestClose={onRequestClose}
              onRequestSave={this.handleSave}
            />
          </div>
          <div className="card-body">
            {/* Manage to show the errors, if any */}
            {errors.length ? <AlertNotice message={errors.join("\n")} /> : ""}

            {loading ? (
              <Loader />
            ) : (
              <Fragment>
                <Title />

                <div className="row has-scrollbar scrollbar">
                  <div className="col-8 pt-3">
                    {spineConcepts.map((concept) => {
                      /**
                       * Instantiate the alignment to pass to the spine concept row through props
                       */
                      let _alignment = alignmentConcepts.find(
                        (alignment) => alignment.spine_concept_id == concept.id
                      );

                      return (
                        <SpineConceptRow
                          key={concept.id}
                          alignment={_alignment}
                          concept={concept}
                          mappingOrigin={mappingOrigin}
                          spineOrigin={spineOrigin}
                          predicates={predicates}
                          onPredicateSelected={(predicate) =>
                            this.handleOnPredicateSelected(concept, predicate)
                          }
                          selectedCount={
                            this.filteredMappingConcepts({ pickSelected: true })
                              .length
                          }
                        />
                      );
                    })}
                  </div>
                  <div className="col-4 bg-col-secondary pt-3">
                    <MappingConceptsList
                      mappingOrigin={mappingOrigin}
                      filteredMappingConcepts={this.filteredMappingConcepts}
                      onMappingConceptClick={this.onMappingConceptClick}
                      afterDropConcept={this.handleAfterDropConcept}
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
