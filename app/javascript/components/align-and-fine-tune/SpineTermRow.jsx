import React, { useState } from "react";
import EditAlignment from "./EditAlignment";
import { toastr as toast } from "react-redux-toastr";
import Collapsible from "../shared/Collapsible";
import MatchVocabulary from "./match-vocabulary/MatchVocabulary";
import DropZone from "../shared/DropZone";
import PredicateOptions from "../shared/PredicateOptions";
import { DraggableItemTypes } from "../shared/DraggableItemTypes";
import VocabularyLabel from "./match-vocabulary/VocabularyLabel";
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faTimes } from "@fortawesome/free-solid-svg-icons";

/**
 * Props:
 * @prop {String} origin The organization name of the mapping
 * @prop {String} spineOrigin The organization name of the spine specification
 * @prop {Object} term The spine term
 * @prop {Array} predicates The collection of predicates
 * @prop {Function} onPredicateSelected The actions to execute when a predicate is selected
 * @prop {Function} mappedTermsToSpineTerm The list of terms that are mapped to a given spine term
 * @prop {Function} onRevertMapping The actions to execute when the user wants to revert a term from being mapped
 */
const SpineTermRow = (props) => {
  /**
   * The data passed in props
   */
  const {
    mappedTermsToSpineTerm,
    origin,
    onRevertMapping,
    predicates,
    selectedAlignments,
    spineOrigin,
    term,
  } = props;

  /**
   * The mapping term (alignment) representing this row
   */
  const [alignment, setAlignment] = useState(props.alignment);

  /**
   * The selected mode to open the edit window
   */
  const [editMode, setEditMode] = useState("comment");

  /**
   * The predicate option selected (the strongest match predicate by default)
   */
  const [predicate, setPredicate] = useState(() =>
    predicates.find((predicate) => predicate.id === alignment.predicateId)?.pref_label
  );

  /**
   * Whether we are editing the alignment or not. Set to true when
   * the user selects an option from the alignment dropdown after selecting a predicate
   */
  const [editing, setEditing] = useState(false);

  /**
   * Whether we are matching vocabulary for the alignment or not. Set to true when
   * the user clicks on the vocabulary link on the mapped term of this alignment
   */
  const [matchingVocab, setMatchingVocab] = useState(false);

  /**
   * The term we are using to match vocabularies against the spine
   */
  const [mappedTermMatching, setMappedTermMatching] = useState(
    mappedTermsToSpineTerm(term)[0]
  );

  /**
   * If the mapping term (alignment) has a predicate selected, lets find it.
   * Otherwise use the strongest match predicate
   */
  // const findPredicate = ;

  /**
   * Return the options for an alignment that is a alignment that has
   * already a predicate selected.
   */
  const alignmentOptions = () => {
    let options = [
      { id: 1, name: "Edit" },
      { id: 2, name: "Comment" },
    ];

    return (
      <React.Fragment>
        {options.map((option) => {
          return (
            <div
              key={option.id}
              className="p-2 cursor-pointer hover-col-primary border-bottom"
              onClick={() => handlePredicateOptionSelected(option)}
            >
              {option.name}
            </div>
          );
        })}
      </React.Fragment>
    );
  };

  /**
   * Determines whether to show the vocabularies matching window or not.
   * It will depend on both the spine term having a vocabulary associated
   * and the mapped term either.
   */
  const alignmentHasVocabulary = () => {
    return (
      term.vocabularies?.length &&
      mappedTermsToSpineTerm(term).some((mTerm) => mTerm.vocabularies?.length)
    );
  };

  /**
   * Manage to show a card when there's a predicate selected.
   * If there's a comment, show an orange dot.
   */
  const predicateSelectedCard = () => {
    return (
      <React.Fragment>
        {alignment.comment && (
          <FontAwesomeIcon
            icon={faCircle}
            className="fa-xs col-success float-left comment-dot"
          />
        )}
        <strong>{predicate}</strong>
      </React.Fragment>
    );
  };

  /**
   * Manage to decide the actions when an option is selected in the
   * edit/comment on Alignment dropdown menu.
   *
   * @param {Object} option
   */
  const handlePredicateOptionSelected = (option) => {
    switch (option.name.toLowerCase()) {
      case "edit":
        setEditMode("edit");
        setEditing(true);
        break;
      case "comment":
        setEditMode("comment");
        setEditing(true);
        break;
      default:
        break;
    }
  };

  /**
   * Actions to take when a predicate has been selected for a mapping term
   *
   * @param {Object} predicate
   */
  const handlePredicateSelected = (term, predicate) => {
    setPredicate(predicate.name);
    props.onPredicateSelected(term, predicate);
  };

  /**
   * Actions to take when a predicate has been selected for a mapping term
   *
   * @param {Object} result
   */
  const handleOnPredicateUpdated = (result) => {
    if (result.saved) {
      toast.success("Changes saved!");

      setPredicate(result.predicate.name);
      props.onPredicateSelected(term, result.predicate);
    }
    setEditing(false);
  };

  /**
   * After saving the comment on the alignment.
   *
   * @param {String} result
   */
  const handleOnCommentUpdated = (result) => {
    if (result.saved) {
      toast.success("Changes saved!");
    }

    /// Update the mapping term in state (if there's a comment, we need to
    /// redraw in order to let the orange dot to appear)
    let tempAlignment = alignment;
    alignment.comment = result.comment;
    setAlignment(tempAlignment);

    setEditing(false);
  };

  /**
   * @description Handles the reverting action, by both calling the callback in props and ensuring
   * the local state is updated.
   *
   * @param {Object} mTerm The mapped term that's going to be detached from the alignment
   */
  const handleRevertMapping = (mTerm) => {
    onRevertMapping(mTerm);

    if (!alignment.mappedTerms.length) {
      setPredicate(null);
    }
  };

  /**
   * Manages the actions when a user clicks to open the match vocabulary
   */
  const handleMatchVocabularyClick = (mappedTerm) => {
    setMappedTermMatching(mappedTerm);
    setMatchingVocab(true);
  };

  /**
   * Closes the modal window for editing the alignment and cancel editing the alignment
   */
  const onRequestEditClose = () => {
    setEditing(false);
  };

  /**
   * Closes the modal window for matching vocabularies
   */
  const onRequestVocabsClose = () => {
    setMatchingVocab(false);
  };

  return (
    <React.Fragment>
      {alignment.predicateId && (
        <EditAlignment
          modalIsOpen={editing}
          onCommentUpdated={(result) => handleOnCommentUpdated(result)}
          onPredicateUpdated={(result) => handleOnPredicateUpdated(result)}
          predicates={predicates}
          alignment={alignment}
          spineTerm={term}
          predicate={predicates.find(
            (predicate) => predicate.id === alignment.predicateId
          )}
          mode={editMode}
          onRequestClose={onRequestEditClose}
        />
      )}

      {alignmentHasVocabulary() ? (
        <MatchVocabulary
          modalIsOpen={matchingVocab}
          onRequestClose={onRequestVocabsClose}
          mappingOrigin={origin}
          spineOrigin={spineOrigin}
          spineTerm={term}
          mappedTerm={mappedTermMatching}
          predicates={predicates}
          alignment={alignment}
        />
      ) : (
        ""
      )}
      <div className="row mb-2" key={term.id}>
        <div className="col-5">
          <Collapsible
            expanded
            headerContent={<strong>{term.name}</strong>}
            cardStyle={"with-shadow mb-2"}
            observeOutside={false}
            bodyContent={
              <>
                {term.sourceUri && (
                  <h6 className="card-subtitle mb-2 text-muted">
                    Name: <strong>{term.sourceUri.split(/[/:]/).pop()}</strong>
                  </h6>
                )}
                <p className="card-text">{term.property.comment}</p>
                <p className="card-text">
                  Origin:
                  {" "}
                  <span className="col-primary">{term.synthetic ? origin : term.organization.name}</span>
                </p>

                {alignmentHasVocabulary() ? (
                  <VocabularyLabel term={term} />
                ) : (
                  ""
                )}
              </>
            }
          />
        </div>

        <div className="col-3">
          {predicate && !term.synthetic ? (
            <Collapsible
              headerContent={predicateSelectedCard()}
              bodyContent={alignmentOptions()}
              cardStyle={"with-shadow mb-2"}
              observeOutside={true}
              bodyStyle={"p-0"}
              cardHeaderStyle={"border-bottom"}
            />
          ) : (
            <PredicateOptions
              predicates={predicates}
              onPredicateSelected={(predicate) =>
                handlePredicateSelected(term, predicate)
              }
              predicate={predicate}
            />
          )}
        </div>

        <div className="col-4">
          {mappedTermsToSpineTerm(term).map((mTerm) => {
            return (
              <Collapsible
                expanded
                headerContent={
                  <div className="row">
                    <div
                      className="col-1 cursor-pointer"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Revert selecting this term"
                      onClick={() => handleRevertMapping(mTerm)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </div>
                    <div className="col-10">
                      <strong>{mTerm.name}</strong>
                    </div>
                  </div>
                }
                cardStyle={"with-shadow mb-2"}
                key={mTerm.id}
                observeOutside={false}
                bodyContent={
                  <React.Fragment>
                    {mTerm.sourceUri && (
                      <h6 className="card-subtitle mb-2 text-muted">
                        Name: <strong>{mTerm.sourceUri.split(/[/:]/).pop()}</strong>
                      </h6>
                    )}
                    <p  className="card-text">{mTerm.property.comment}</p>
                    <p  className="card-text">
                      Origin:
                      <span className="col-primary">{" " + origin}</span>
                    </p>
                    {alignmentHasVocabulary() ? (
                      <VocabularyLabel
                        onVocabularyClick={handleMatchVocabularyClick}
                        term={mTerm}
                      />
                    ) : (
                      ""
                    )}
                  </React.Fragment>
                }
              />
            );
          })}
          {!mappedTermsToSpineTerm(term).length && (
            <DropZone
              selectedCount={selectedAlignments.length}
              acceptedItemType={DraggableItemTypes.PROPERTIES_SET}
              droppedItem={{ id: term.id }}
              placeholder="Drag a matching property here"
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default SpineTermRow;
