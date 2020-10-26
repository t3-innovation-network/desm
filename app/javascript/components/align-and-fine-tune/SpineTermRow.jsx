import React, { useState } from "react";
import SpineTermDropZone from "../mapping-to-domains/SpineTermDropZone";
import ExpandableOptions from "../shared/ExpandableOptions";
import EditAlignment from "./EditAlignment";
import { toastr as toast } from "react-redux-toastr";
import Collapsible from "../shared/Collapsible";

/**
 * Props:
 * @param {String} origin The organization name of the mapping
 * @param {String} spineOrigin The organization name of the spine specification
 * @param {Object} term The spine term
 * @param {Object} term The spine term
 * @param {Array} predicates The collection of predicates
 * @param {Function} onPredicateSelected The actions to execute when a predicate is selected
 * @param {Function} mappedTermsToSpineTerm The list of terms that are mapped toa given spine term
 */
const SpineTermRow = (props) => {
  /**
   * The data passed in props
   */
  const { term, predicates } = props;

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
   * Return the list of predicates as options to use on the abstract
   * expandable options component
   */
  const predicatesAsOptions = () => {
    return predicates.map((predicate) => {
      return {
        name: predicate.pref_label,
        id: predicate.id,
      };
    });
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
   * Closes the modal window and cancel editing the alignment
   */
  const onRequestClose = () => {
    setEditing(false);
  };

  return (
    <React.Fragment>
      {mappingTerm.predicate_id && (
        <EditAlignment
          modalIsOpen={editing}
          onCommentUpdated={(result) => handleOnCommentUpdated(result)}
          onPredicateUpdated={(result) => handleOnPredicateUpdated(result)}
          predicatesAsOptions={predicatesAsOptions}
          mappingTerm={mappingTerm}
          spineTerm={term}
          predicate={predicates.find(
            (predicate) => predicate.id === mappingTerm.predicate_id
          )}
          mode={editMode}
          onRequestClose={onRequestClose}
        />
      )}
      <div className="row mb-2" key={term.id}>
        <div className="col-5">
          <Collapsible
            headerContent={<strong>{term.name}</strong>}
            cardStyle={"with-shadow mb-2"}
            bodyContent={
              <React.Fragment>
                <p>{term.property.comment}</p>
                <p>
                  Origin:
                  <span className="col-primary">{" " + props.spineOrigin}</span>
                </p>
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
            <ExpandableOptions
              options={predicatesAsOptions()}
              onClose={(predicate) => handlePredicateSelected(term, predicate)}
              selectedOption={predicate}
            />
          )}
        </div>

        <div className="col-4">
          {props.mappedTermsToSpineTerm(term).length > 0 ? (
            props.mappedTermsToSpineTerm(term).map((term) => {
              return (
                <Collapsible
                  headerContent={<strong>{term.name}</strong>}
                  cardStyle={"with-shadow mb-2"}
                  key={term.id}
                  bodyContent={
                    <React.Fragment>
                      <p>{term.property.comment}</p>
                      <p>
                        Origin:
                        <span className="col-primary">{" " + props.origin}</span>
                      </p>
                    </React.Fragment>
                  }
                />
              );
            })
          ) : (
            <SpineTermDropZone
              term={term}
              selectedTermsCount={props.selectedMappingTerms.length}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default SpineTermRow;
