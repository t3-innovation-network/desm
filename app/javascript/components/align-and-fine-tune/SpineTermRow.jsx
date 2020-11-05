import React, { useState } from "react";
import EditAlignment from "./EditAlignment";
import { toastr as toast } from "react-redux-toastr";
import Collapsible from "../shared/Collapsible";
import MatchVocabulary from "./match-vocabulary/MatchVocabulary";
import DropZone from "../shared/DropZone";
import PredicateOptions from "../shared/PredicateOptions";
import { DraggableItemTypes } from "../shared/DraggableItemTypes";
import VocabularyLabel from "./match-vocabulary/VocabularyLabel";

/**
 * Props:
 * @param {String} origin The organization name of the mapping
 * @param {String} spineOrigin The organization name of the spine specification
 * @param {Object} term The spine term
 * @param {Array} predicates The collection of predicates
 * @param {Function} onPredicateSelected The actions to execute when a predicate is selected
 * @param {Function} mappedTermsToSpineTerm The list of terms that are mapped toa given spine term
 */
const SpineTermRow = (props) => {
  /**
   * The data passed in props
   */
  const {
    term,
    predicates,
    spineOrigin,
    origin,
    mappedTermsToSpineTerm,
  } = props;

  /**
   * The mapping term (alignment) representing this row
   */
  const [mappingTerm, setMappingTerm] = useState(props.mappingTerm);

  /**
   * The selected mode to open the edit window
   */
  const [editMode, setEditMode] = useState("comment");

  /**
   * The predicate option selected
   */
  const [predicate, setPredicate] = useState(findPredicate());

  /**
   * Whether we are editing the alignment or not. Set to true when
   * the user selects an option from the alginment dropdown after selecting a predicate
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
   * If the mapping term (alignment) has a predicate selected, lets find it
   */
  function findPredicate() {
    return mappingTerm.predicate_id
      ? predicates.find(
          (predicate) => predicate.id === mappingTerm.predicate_id
        ).pref_label
      : null;
  }

  /**
   * Return the options for an alignment that is a mappingTerm that has
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
   * Manage to show a card when there's a predicate selected.
   * If there's a comment, show an orange dot.
   */
  const predicateSelectedCard = () => {
    return (
      <React.Fragment>
        {mappingTerm.comment && (
          <i className="fas fa-circle fa-xs col-success float-left comment-dot"></i>
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
   * @param {Object} predicate
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
   * @param {String} comment
   */
  const handleOnCommentUpdated = (result) => {
    if (result.saved) {
      toast.success("Changes saved!");
    }

    /// Update the mapping term in state (if there's a comment, we need to
    /// redraw in order to let the orange dot to appear)
    let tempMappingTerm = mappingTerm;
    mappingTerm.comment = result.comment;
    setMappingTerm(tempMappingTerm);

    setEditing(false);
  };

  /**
   * MAnages the actions when a user clicks to open the match vocabulary
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
      {mappingTerm.predicate_id && (
        <EditAlignment
          modalIsOpen={editing}
          onCommentUpdated={(result) => handleOnCommentUpdated(result)}
          onPredicateUpdated={(result) => handleOnPredicateUpdated(result)}
          predicates={predicates}
          mappingTerm={mappingTerm}
          spineTerm={term}
          predicate={predicates.find(
            (predicate) => predicate.id === mappingTerm.predicate_id
          )}
          mode={editMode}
          onRequestClose={onRequestEditClose}
        />
      )}

      {term.vocabularies?.length &&
      props
        .mappedTermsToSpineTerm(term)
        .some((mTerm) => mTerm.vocabularies && mTerm.vocabularies.length) ? (
        <MatchVocabulary
          modalIsOpen={matchingVocab}
          onRequestClose={onRequestVocabsClose}
          mappingOrigin={origin}
          spineOrigin={spineOrigin}
          spineTerm={term}
          mappedTerm={mappedTermMatching}
          predicates={predicates}
          mappingTerm={mappingTerm}
        />
      ) : (
        ""
      )}
      <div className="row mb-2" key={term.id}>
        <div className="col-5">
          <Collapsible
            headerContent={<strong>{term.name}</strong>}
            cardStyle={"with-shadow mb-2"}
            observeOutside={false}
            bodyContent={
              <React.Fragment>
                <p>{term.property.comment}</p>
                <p>
                  Origin:
                  <span className="col-primary">{" " + spineOrigin}</span>
                </p>

                <VocabularyLabel term={term} />
              </React.Fragment>
            }
          />
        </div>

        <div className="col-3">
          {predicate ? (
            <Collapsible
              headerContent={predicateSelectedCard()}
              bodyContent={alignmentOptions()}
              cardStyle={"with-shadow mb-2"}
              observeOutside={true}
              bodyStyle={"p-0"}
              cardHeaderStyle={"border-bottom"}
            />
          ) : term.synthetic ? (
            <div className="card">
              <div className="card-header bg-col-primary col-background">
                Synthetic
              </div>
            </div>
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
          {props.mappedTermsToSpineTerm(term).map((term) => {
            return (
              <Collapsible
                headerContent={<strong>{term.name}</strong>}
                cardStyle={"with-shadow mb-2"}
                key={term.id}
                observeOutside={false}
                bodyContent={
                  <React.Fragment>
                    <p>{term.property.comment}</p>
                    <p>
                      Origin:
                      <span className="col-primary">{" " + origin}</span>
                    </p>

                    <VocabularyLabel
                      term={term}
                      onVocabularyClick={handleMatchVocabularyClick}
                      clickable={true}
                    />
                  </React.Fragment>
                }
              />
            );
          })}
          {!props.mappedTermsToSpineTerm(term).length && (
            <DropZone
              selectedCount={props.selectedMappingTerms.length}
              acceptedItemType={DraggableItemTypes.PROPERTIES_SET}
              droppedItem={{ id: term.id }}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default SpineTermRow;
