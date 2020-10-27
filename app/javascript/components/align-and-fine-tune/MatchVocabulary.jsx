import React, { Fragment, useEffect, useState } from "react";
import Modal from "react-modal";
import fetchVocabulary from "../../services/fetchVocabulary";
import AlertNotice from "../shared/AlertNotice";
import Collapsible from "../shared/Collapsible";
import ExpandableOptions from "../shared/ExpandableOptions";
import Loader from "../shared/Loader";
import ModalStyles from "../shared/ModalStyles";
import ConceptDropZone from "./ConceptDropZone";

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
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
    >
      <div className="card">
        <div className="card-header no-color-header border-bottom">
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
        </div>
        <div className="card-body">
          {errors.length ? <AlertNotice message={errors.join("\n")} /> : ""}
          {loading ? (
            <Loader />
          ) : (
            <Fragment>
              <div className="row mb-3">
                <div className="col-8"><h4>T3 Spine</h4></div>
                <div className="col-4"><h4>{mappingOrigin}</h4></div>
              </div>
              <div className="row">
                <div className="col-8">
                  {/* Spine vocabulary concepts */}
                  {spineVocabulary.concepts.map((concept) => {
                    return (
                      <div className="row mb-2">
                        <div className="col-4">
                          <Collapsible
                            headerContent={<strong>{concept.name}</strong>}
                            cardStyle={"with-shadow mb-2"}
                            observeOutside={false}
                            bodyContent={
                              <React.Fragment>
                                <p>{concept.definition}</p>
                                <p>
                                  Origin:
                                  <span className="col-primary">
                                    {" " + props.spineOrigin}
                                  </span>
                                </p>
                              </React.Fragment>
                            }
                          />
                        </div>

                        <div className="col-4">
                          <ExpandableOptions
                            options={predicatesAsOptions()}
                            onClose={(predicate) =>
                              handlePredicateSelected(predicate)
                            }
                            selectedOption={null}
                          />
                        </div>

                        <div className="col-4">
                          <ConceptDropZone
                            concept={concept}
                            selectedCount={1}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="col-4">
                  {/* Mapping vocabulary concepts */}
                  {mappedTermVocabulary.concepts.map((concept) => {
                    return (
                      <div className="row">
                        <div className="col">
                          <Collapsible
                            headerContent={<strong>{concept.name}</strong>}
                            cardStyle={"with-shadow mb-2"}
                            observeOutside={false}
                            bodyContent={
                              <React.Fragment>
                                <p>{concept.definition}</p>
                                <p>
                                  Origin:
                                  <span className="col-primary">
                                    {" " + props.mappingOrigin}
                                  </span>
                                </p>
                              </React.Fragment>
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
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
