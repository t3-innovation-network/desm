import { Component } from 'react';
import Modal from 'react-modal';
import fetchAlignmentVocabulary from '../../../services/fetchAlignmentVocabulary';
import fetchVocabularyConcepts from '../../../services/fetchVocabularyConcepts';
import updateAlignmentVocabularyConcept from '../../../services/updateAlignmentVocabularyConcept';
import AlertNotice from '../../shared/AlertNotice';
import Loader from '../../shared/Loader';
import ModalStyles from '../../shared/ModalStyles';
import HeaderContent from './HeaderContent';
import MappingConceptsList from './MappingConceptsList';
import SpineConceptRow from './SpineConceptRow';
import createSyntheticVocabularyConcept from '../../../services/createSyntheticVocabularyConcept';
import Pluralize from 'pluralize';
import { showSuccess } from '../../../helpers/Messages';

/**
 * Props
 * @prop {Function} onRequestClose
 * @prop {Boolean} modalIsOpen
 * @prop {String} spineOrigin
 * @prop {String} mappingOrigin
 * @prop {Object} mappedTerm
 * @prop {Object} alignment
 * @prop {Object} spineTerm
 * @prop {Array} predicates
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
    /**
     * Whether any change was performed after the page loads
     */
    changesPerformed: 0,
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
  changedAlignments = () => this.state.alignmentConcepts.filter((alignment) => alignment.updated);

  /**
   * Mark the term as "selected"
   */
  onMappingConceptClick = (clickedConcept) => {
    const { mappingConcepts } = this.state;
    let concept = mappingConcepts.find((c) => c.id === clickedConcept.id);
    concept.selected = !concept.selected;

    this.setState({ mappingConcepts: mappingConcepts });
  };

  /**
   * Actions to take when a predicate has been selected for a mapping term
   * The alignment vocabulary concept is matched with the selected predicate in memory
   *
   * @param concept
   * @param {Object} predicate
   */
  handleOnPredicateSelected = (concept, predicate) => {
    const { alignmentConcepts, changesPerformed } = this.state;

    let alignment = alignmentConcepts.find((conc) => conc.spineConceptId === concept.id);
    alignment.predicateId = predicate.id;
    alignment.updated = true;

    this.setState({
      alignmentConcepts: alignmentConcepts,
      changesPerformed: changesPerformed + 1,
    });
  };

  /**
   * Actions to perform when concepts were dropped into a synthetic alignment (No Match)
   *
   * @param {Object} alignment
   */
  handleDropOnSynthetic = (alignment) => {
    const { spineConcepts } = this.state;

    /// Instantiate the spine concept
    let spineConcept = spineConcepts.find((concept) => concept.id === alignment.spineConceptId);

    /// Name the synthetic spine concept
    let [mappedConcept] = alignment.mappedConceptsList;
    spineConcept.name = mappedConcept.name;
  };

  /**
   * Actions when a concept or set of concepts are dropped into an alignment
   *
   * @param spineData
   */
  handleAfterDropConcept = (spineData) => {
    const { alignmentConcepts, mappingConcepts, changesPerformed } = this.state;

    /// Get the alignment (information about vocabulary being mapped)
    let alignment = alignmentConcepts.find(
      (concept) => concept.spineConceptId === spineData.spineConceptId
    );

    /// Update the mapped concepts
    alignment.mappedConceptsList = this.filteredMappingConcepts({
      pickSelected: true,
    });

    alignment.updated = true;

    if (alignment.synthetic) {
      this.handleDropOnSynthetic(alignment);
    }

    /// Deselect the selected concepts
    this.filteredMappingConcepts({ pickSelected: true }).forEach(
      (concept) => (concept.selected = false)
    );

    /// Update the UI
    this.setState({
      alignmentConcepts: alignmentConcepts,
      mappingConcepts: mappingConcepts,
      changesPerformed: changesPerformed + 1,
    });
  };

  /**
   * Add a new synthetic concept row. This, in order to be able to map
   * a concept as "No Match".
   */
  addSyntheticConceptRow = () => {
    const { alignmentConcepts, spineConcepts } = this.state;
    const { predicates } = this.props;

    let nextSpineConceptId = _.maxBy(spineConcepts, 'id').id + 1;
    let nextAlignmentId = _.maxBy(alignmentConcepts, 'id').id + 1;

    // Add a synthetic concept to have the chance to match concepts to
    // the "No Match" predicate option.
    spineConcepts.unshift({
      id: nextSpineConceptId,
      name: '',
      definition: 'Synthetic concept added to the vocabulary',
      synthetic: true,
    });

    // Add the corresponding synthetic alignment
    alignmentConcepts.push({
      id: nextAlignmentId,
      predicateId: predicates.find((p) => p.strongest_match)?.id,
      spineConceptId: nextSpineConceptId,
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
    if (response.error) {
      this.setState({ errors: [...this.state.errors, response.error] });
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
          predicateId: alignment.predicateId,
          mappedConcepts: alignment.mappedConceptsList.map((concept) => concept.id),
        });

        // Stop the execution on any error. The details will be shown on the screen by AlertNotice
        if (this.anyError(response)) {
          return;
        }
      });
  };

  /**
   * Save all those alignments added manually
   */
  saveSyntheticAlignments = () => {
    const { spineConcepts, alignmentConcepts } = this.state;

    this.changedAlignments()
      .filter((a) => a.synthetic)
      .forEach((alignment) => {
        let spineConcept = spineConcepts.find((sc) => sc.id === alignment.spineConceptId);
        let response = createSyntheticVocabularyConcept({
          spine_concept: {
            uri: 'http://desm.org/concepts/concepts/' + spineConcept.name,
            raw: {
              id: 'http://desm.org/concepts/concepts/' + spineConcept.name,
              type: 'skos:Concept',
              prefLabel: {
                'en-us': spineConcept.name,
              },
              definition: {
                'en-us': 'Synthetic concept added to the vocabulary for ' + spineConcept.name,
              },
              inScheme: 'http://desm.org/concepts/mappingClasses',
            },
          },
          alignment: {
            predicate_id: 7,
            alignment_vocabulary_id: alignmentConcepts[0]?.alignmentVocabularyId,
            mapped_concepts: alignment.mappedConceptsList.map((mc) => mc.id),
          },
        });

        // Stop the execution on any error. The details will be shown on the screen by AlertNotice
        if (this.anyError(response)) {
          return;
        }
      });
  };

  /**
   * Saves the alignment changes
   */
  handleSave = () => {
    const { onRequestClose } = this.props;

    this.saveChangedAlignments();
    this.saveSyntheticAlignments();

    showSuccess('The vocabulary changes were successfully saved!');
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
      this.setState({ spineConcepts: response.vocabulary?.concepts });
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
      this.setState({ mappingConcepts: response.vocabulary?.concepts });
    }
  };

  /**
   * Get the alignment vocabulary. This is the vocabulary for the
   */
  handleFetchAlignmentVocabulary = async () => {
    const { alignment } = this.props;

    let response = await fetchAlignmentVocabulary(alignment.id);

    if (!this.anyError(response)) {
      // Set the alignment vocabulary concepts on state
      this.setState({ alignmentConcepts: response.alignmentConcepts });
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
   * Use the API to get the information and update the internal status
   */
  handleFetchDataFromAPI = async () => {
    this.setState({ loading: true });

    await this.fetchDataFromAPI();
    this.setState({ loading: false });
  };

  /**
   * Set the window properly in the body element at the load stage
   */
  componentDidMount = () => {
    Modal.setAppElement('body');
    this.handleFetchDataFromAPI();
  };

  /**
   * Fetch the date from the API, using the mappedTerm and the spineTerm props
   *
   * @param prevProps
   */
  componentDidUpdate = (prevProps) => {
    if (this.props.mappedTerm !== prevProps.mappedTerm) {
      this.handleFetchDataFromAPI();
    }
  };

  render() {
    const { modalIsOpen, onRequestClose, mappingOrigin, spineOrigin, predicates } = this.props;

    const { loading, errors, spineConcepts, alignmentConcepts, changesPerformed } = this.state;

    /**
     * Structure for the title
     */
    const Title = () => {
      return (
        <div className="row mb-3">
          <div className="col-8">
            <div className="row">
              <div className="col-4">
                <h4 className="text-center">T3 Spine</h4>
              </div>
              <div className="col-4 offset-4">
                <h4 className="text-center">{mappingOrigin}</h4>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="float-left">
              <button
                className="btn btn-dark"
                onClick={this.addSyntheticConceptRow}
                title="Use this button to add new elements to the spine"
              >
                + Add Synthetic
              </button>
            </div>
            <div className="float-right">
              {this.filteredMappingConcepts({ pickSelected: true }).length +
                ' ' +
                Pluralize('concept', this.filteredMappingConcepts({ pickSelected: true }).length) +
                ' selected'}
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
        {loading ? (
          <Loader />
        ) : (
          <div className="card p-5">
            <div className="card-header no-color-header border-bottom pb-3">
              <HeaderContent
                onRequestClose={onRequestClose}
                onRequestSave={this.handleSave}
                disableSave={!changesPerformed}
              />
            </div>
            <div className="card-body">
              {/* Manage to show the errors, if any */}
              {errors.length ? (
                <AlertNotice message={errors} onClose={() => this.setState({ errors: [] })} />
              ) : (
                ''
              )}

              {loading ? (
                <Loader />
              ) : (
                <>
                  <Title />

                  <div className="row">
                    <div className="col-8 pt-3 has-scrollbar scrollbar">
                      {spineConcepts.map((concept) => {
                        /**
                         * Instantiate the alignment to pass to the spine concept row through props
                         */
                        let _alignment = alignmentConcepts.find(
                          (alignment) => alignment.spineConceptId === concept.id
                        );

                        return !_.isUndefined(_alignment) ? (
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
                              this.filteredMappingConcepts({
                                pickSelected: true,
                              }).length
                            }
                          />
                        ) : (
                          ''
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
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    );
  }
}
