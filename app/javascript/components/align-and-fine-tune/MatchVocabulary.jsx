import React, { Component, Fragment, useEffect, useState } from "react";
import Modal from "react-modal";
import fetchVocabulary from "../../services/fetchVocabulary";
import AlertNotice from "../shared/AlertNotice";
import Collapsible from "../shared/Collapsible";
import ExpandableOptions from "../shared/ExpandableOptions";
import Loader from "../shared/Loader";
import ModalStyles from "../shared/ModalStyles";
import DropZone from "../shared/DropZone";
import Draggable from "../shared/Draggable";
import { ItemTypes } from "../mapping-to-domains/ItemTypes";

/**
 * Props
 * @param {Function} onRequestClose
 * @param {Boolean} modalIsOpen
 * @param {String} spineOrigin
 * @param {String} mappingOrigin
 * @param {Object} mappedTerm
 * @param {Object} spineTerm
 * @param {Function} predicatesAsOptions
 */
const MatchVocabulary = (props) => {
  Modal.setAppElement("body");

  /**
   * Values from props
   */
  const {
    onRequestClose,
    modalIsOpen,
    spineOrigin,
    mappingOrigin,
    spineTerm,
    mappedTerm,
    predicatesAsOptions,
  } = props;

  /**
   * Whether the page is loading results or not
   */
  const [loading, setLoading] = useState(true);

  /**
   * Manage the errors on this screen
   */
  const [errors, setErrors] = useState([]);

  /**
   * The vocabulary for the spine term
   */
  const [spineVocabulary, setSpineVocabulary] = useState([]);

  /**
   * The vocabulary for the mapped term
   */
  const [mappedTermVocabulary, setMappedTermVocabulary] = useState([]);

  /**
   * The selected concepts.
   */
  const selectedMappingConcepts = _.isEmpty(mappedTermVocabulary)
    ? []
    : mappedTermVocabulary.concepts.filter((concept) => {
        return concept.selected;
      });

  /**
   * Mark the term as "selected"
   */
  const onMappingConceptClick = (clickedConcept) => {
    let tempVocabulary = mappedTermVocabulary;
    let concept = tempVocabulary.concepts.find(
      (c) => c.id == clickedConcept.id
    );
    concept.selected = !concept.selected;

    setMappedTermVocabulary([]);
    setMappedTermVocabulary(tempVocabulary);
  };

  /**
   * Structure of the header for this component
   */
  const headerContent = () => {
    return (
      <div className="row">
        <div className="col-6">
          <h3>Match Controlled Vocabulary</h3>
        </div>
        <div className="col-6 text-right">
          <button
            className="btn btn-outline-secondary mr-2"
            onClick={onRequestClose}
          >
            Cancel
          </button>
          <button className="btn btn-dark">Save Mapping</button>
        </div>
      </div>
    );
  };

  /**
   * List the concepts for the spine term vocabulary as cards with the options to map
   */
  const spineConceptsList = () => {
    /**
     * The concept as a card
     *
     * @param {Object} concept
     */
    const conceptCard = (concept) => {
      return (
        <Collapsible
          headerContent={<strong>{concept.name}</strong>}
          cardStyle={"with-shadow mb-2"}
          observeOutside={false}
          bodyContent={
            <React.Fragment>
              <p>{concept.definition}</p>
              <p>
                Origin:
                <span className="col-primary">{" " + spineOrigin}</span>
              </p>
            </React.Fragment>
          }
        />
      );
    };

    /**
     * The predicates list as "Expandable"
     */
    const predicateOptions = () => {
      return (
        <ExpandableOptions
          options={predicatesAsOptions()}
          onClose={(predicate) => handlePredicateSelected(predicate)}
          selectedOption={null}
        />
      );
    };

    return spineVocabulary.concepts.map((concept) => {
      return (
        <div className="row mb-2" key={concept.id}>
          <div className="col-4">{conceptCard(concept)}</div>

          <div className="col-4">{predicateOptions()}</div>

          <div className="col-4">
            <DropZone
              draggable={{ id: concept.id }}
              selectedCount={1}
              textStyle={{ fontSize: "12px" }}
            />
          </div>
        </div>
      );
    });
  };

  /**
   * List the concepts for the mapped term vocabulary as selectable cards
   */
  const mappingConceptsList = () => {
    return (
      <Fragment>
        {/* SELECTED TERMS */}
        <Draggable
          items={selectedMappingConcepts}
          itemType={ItemTypes.BOXSET}
        >
          {selectedMappingConcepts.map((concept) => {
            return (
              <ConceptCard
                key={concept.id}
                concept={concept}
                onClick={onMappingConceptClick}
                origin={mappingOrigin}
              />
            );
          })}
        </Draggable>
        {/* END SELECTED TERMS */}

        {/* NOT SELECTED TERMS */}
        {mappedTermVocabulary.concepts.map((concept) => {
          return (
            <ConceptCard
              key={concept.id}
              concept={concept}
              onClick={onMappingConceptClick}
              origin={mappingOrigin}
            />
          );
        })}
        {/* END NOT SELECTED TERMS */}
      </Fragment>
    );
  };

  /**
   * Handle showing the errors on screen, if any
   *
   * @param {HttpResponse} response
   */
  function anyError(response) {
    if (response.error) {
      let tempErrors = errors;
      tempErrors.push(response.error);
      setErrors([]);
      setErrors(tempErrors);
    }
    /// It will return a truthy value (depending no the existence
    /// of the errors on the response object)
    return !_.isUndefined(response.error);
  }

  /**
   * Get the spine vocabulary
   */
  const handleFetchSpineVocabulary = async () => {
    let response = await fetchVocabulary(spineTerm.vocabularies[0].id);
    if (!anyError(response)) {
      // Set the vocabulary on state
      setSpineVocabulary(response.vocabulary);
    }
  };

  /**
   * Get the spine vocabulary
   */
  const handleFetchMappedTermVocabulary = async () => {
    if (mappedTerm) {
      let response = await fetchVocabulary(mappedTerm.vocabularies[0].id);
      if (!anyError(response)) {
        // Set the vocabulary on state
        setMappedTermVocabulary(response.vocabulary);
      }
    }
  };

  /**
   * Actions to take when a predicate has been selected for a mapping term
   *
   * @param {Object} predicate
   */
  const handlePredicateSelected = (predicate) => {
    // @todo: logic when a predicate is selected
  };

  /**
   * Get the data from the service
   */
  const fetchDataFromAPI = async () => {
    // Get the spine vocabulary
    await handleFetchSpineVocabulary();
    // Get the mapped term vocabulary
    await handleFetchMappedTermVocabulary();
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'fetchDataFromAPI'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  useEffect(() => {
    if (modalIsOpen) {
      async function fetchData() {
        await fetchDataFromAPI();
      }

      setLoading(true);
      fetchData().then(() => {
        if (_.isEmpty(errors)) {
          setLoading(false);
        }
      });
    }
  }, [modalIsOpen]);

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
          {headerContent()}
        </div>
        <div className="card-body">
          {errors.length ? <AlertNotice message={errors.join("\n")} /> : ""}
          {loading ? (
            <Loader />
          ) : (
            <Fragment>
              <div className="row mb-3">
                <div className="col-8">
                  <h4>T3 Spine</h4>
                </div>
                <div className="col-4">
                  <h4>{mappingOrigin}</h4>
                </div>
              </div>
              <div className="row">
                <div className="col-8">{spineConceptsList()}</div>
                <div className="col-4">{mappingConceptsList()}</div>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </Modal>
  );
};

/**
 * Structure of a concept of the mapped term vocabulary
 *
 * @param {Object} concept
 * @param {Function} onClick
 * @param {String} origin
 */
class ConceptCard extends Component {
  /**
   * Internal state for "selected"
   */
  state = {
    selected: this.props.concept.selected,
  };

  /**
   * Internal handler for onclick event
   */
  handleClick = () => {
    const { selected } = this.state;
    const { onClick, concept } = this.props;

    this.setState({ selected: !selected }, () => {
      if (onClick) {
        onClick(concept);
      }
    });
  };

  render() {
    const { concept, origin } = this.props;
    const { selected } = this.state;

    return (
      <Collapsible
        headerContent={<strong>{concept.name}</strong>}
        cardStyle={
          "with-shadow mb-2" + (selected ? " draggable term-selected" : "")
        }
        cardHeaderColStyle={selected ? "" : "cursor-pointer"}
        observeOutside={false}
        handleOnClick={this.handleClick}
        bodyContent={
          <Fragment>
            <p>{concept.definition}</p>
            <p>
              Origin:
              <span className="col-primary">{" " + origin}</span>
            </p>
          </Fragment>
        }
      />
    );
  }
}

export default MatchVocabulary;
