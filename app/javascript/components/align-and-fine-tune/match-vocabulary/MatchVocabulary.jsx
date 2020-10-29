import React, { Fragment, useEffect, useState } from "react";
import Modal from "react-modal";
import fetchVocabulary from "../../../services/fetchVocabulary";
import AlertNotice from "../../shared/AlertNotice";
import Loader from "../../shared/Loader";
import ModalStyles from "../../shared/ModalStyles";
import DropZone from "../../shared/DropZone";
import Draggable from "../../shared/Draggable";
import { ItemTypes } from "../../mapping-to-domains/ItemTypes";
import ConceptCard from "./ConceptCard";
import SpineConceptCard from "./SpineConceptCard";
import PredicateOptions from "../../shared/PredicateOptions";

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
    predicates,
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
   * The vocabulary concepts for the spine term
   */
  const [spineConcepts, setSpineConcepts] = useState([]);

  /**
   * The vocabulary concepts for the mapped term
   */
  const [mappingConcepts, setMappingConcepts] = useState([]);

  /**
   * The mapping vocabulary concepts, filtered by selected/not selected.
   */
  const filteredMappingConcepts = (options = { pickSelected: false }) =>
    mappingConcepts
      .filter((concept) => {
        return options.pickSelected ? concept.selected : !concept.selected;
      })
      .sort((a, b) => (a.name > b.name ? 1 : -1));

  /**
   * Mark the term as "selected"
   */
  const onMappingConceptClick = (clickedConcept) => {
    let concept = mappingConcepts.find((c) => c.id == clickedConcept.id);
    concept.selected = !concept.selected;

    setMappingConcepts([]);
    setMappingConcepts(mappingConcepts);
  };

  /**
   * Structure of the header for this component
   */
  const HeaderContent = () => {
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
  const SpineConceptsList = () => {
    return spineConcepts.map((concept) => {
      return (
        <div className="row mb-2" key={concept.id}>
          <div className="col-4">
            <SpineConceptCard concept={concept} spineOrigin={spineOrigin} />
          </div>
          <div className="col-4">
            <PredicateOptions
              predicates={predicates}
              onPredicateSelected={(concept) =>
                handlePredicateSelected(concept)
              }
            />
          </div>
          <div className="col-4">
            <DropZone
              draggable={{ id: concept.id }}
              selectedCount={
                filteredMappingConcepts({ pickSelected: true }).length
              }
              itemType={ItemTypes.CONCEPTS_SET}
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
  const MappingConceptsList = () => {
    return (
      <Fragment>
        {/* SELECTED CONCEPTS */}
        <Draggable
          items={filteredMappingConcepts({ pickSelected: true })}
          itemType={ItemTypes.CONCEPTS_SET}
        >
          {filteredMappingConcepts({ pickSelected: true }).map((concept) => {
            return (
              <div className="row mb-2" key={concept.id}>
                <div className="col">
                  <ConceptCard
                    concept={concept}
                    onClick={onMappingConceptClick}
                    origin={mappingOrigin}
                  />
                </div>
              </div>
            );
          })}
        </Draggable>
        {/* END SELECTED CONCEPTS */}

        {/* NOT SELECTED CONCEPTS */}
        {filteredMappingConcepts({ pickSelected: false }).map((concept) => {
          return (
            <div className="row mb-2" key={concept.id}>
              <div className="col">
                <ConceptCard
                  concept={concept}
                  onClick={onMappingConceptClick}
                  origin={mappingOrigin}
                />
              </div>
            </div>
          );
        })}
        {/* END NOT SELECTED CONCEPTS */}
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
      setSpineConcepts(response.vocabulary.concepts);
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
        setMappingConcepts(response.vocabulary.concepts);
      }
    }
  };

  /**
   * Actions to take when a predicate has been selected for a mapping term
   *
   * @param {Object} predicate
   */
  const handlePredicateSelected = (concept, predicate) => {
    // @todo: logic when a predicate is selected. The alginment vocabulary concept
    //   is matched with the selected predicate in memory
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
          <HeaderContent />
        </div>
        <div className="card-body">
          {errors.length ? <AlertNotice message={errors.join("\n")} /> : ""}
          {loading ? (
            <Loader />
          ) : (
            <Fragment>
              <div className="row mb-3">
                <div className="col-6">
                  <h4>T3 Spine</h4>
                </div>
                <div className="col-3">
                  <h4>{mappingOrigin}</h4>
                </div>
                <div className="col-3">
                  <div className="float-right">
                    {filteredMappingConcepts({ pickSelected: true }).length +
                      " elements selected"}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-8">
                  <SpineConceptsList />
                </div>
                <div className="col-4 bg-col-secondary">
                  <MappingConceptsList />
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MatchVocabulary;
