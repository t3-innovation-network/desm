import React, { useState } from "react";
import Modal from "react-modal";
import updateAlignment from "../../services/updateAlignment";
import AlertNotice from "../shared/AlertNotice";
import ModalStyles from "../shared/ModalStyles";
import PredicateOptions from "../shared/PredicateOptions";

const EditAlignment = (props) => {
  Modal.setAppElement("body");

  /**
   * Elements from props
   */
  const {
    alignment,
    spineTerm,
    predicate,
    predicates,
    onCommentUpdated,
    onPredicateUpdated,
  } = props;

  /**
   * The mode to use this form. It can be either "comment" or "edit"
   */
  const [mode, setMode] = useState(props.mode);

  /**
   * Controls the button to save the comment. Not to be available when there are no changes to save.
   */
  const [commentChanged, setCommentChanged] = useState(false);

  /**
   * Controls the button to save the predicate. Not to be available when there are no changes to save.
   */
  const [predicateChanged, setPredicateChanged] = useState(false);

  /**
   * Manage the errors on this screen
   */
  const [error, setError] = useState(null);

  /**
   * The value for the comment on the alignment
   */
  const [comment, setComment] = useState(props.alignment.comment);

  /**
   * The predicate selected when editing an alignment
   */
  const [selectedPredicate, setSelectedPredicate] = useState(props.predicate);

  /**
   * Keep the value of the comment while changing (while the user types on the textarea)
   */
  const handleCommentChange = (e) => {
    setCommentChanged(true);
    setComment(e.target.value);
  };

  /**
   * Saves the comment in the alignment
   */
  const handleSaveComment = async () => {
    let response = await updateAlignment({
      id: alignment.id,
      comment: comment,
    });

    if (response.error) {
      setError(response.error);
      return;
    }

    onCommentUpdated({ saved: true, comment: comment });
  };

  /**
   * Manage the change of predicate. Executed when the user clicks on a predicate option
   *
   * @param {Object} predicate
   */
  const handlePredicateSelected = (predicate) => {
    setPredicateChanged(true);
    setSelectedPredicate(predicate);
  };

  /**
   * Save the changes after editing the alignment
   */
  const handleSaveAlignment = async () => {
    let response = await updateAlignment({
      id: alignment.id,
      predicate_id: selectedPredicate.id,
    });

    if (response.error) {
      setError(response.error);
      return;
    }

    onPredicateUpdated({
      saved: true,
      term: alignment,
      predicate: selectedPredicate,
    });
  };

  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={props.onRequestClose}
      contentLabel="Comment"
      style={ModalStyles}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
    >
      <div className="card">
        <div className="card-header">
          <i className="fas fa-comment col-primary"></i>
          <a
            className="float-right cursor-pointer"
            onClick={props.onRequestClose}
          >
            <i className="fas fa-times"></i>
          </a>
        </div>
        <div className="card-body">
          {error && <AlertNotice message={error} />}

          <div className="row">
            <div className="col-4">
              <div className="card">
                <div className="card-header">{spineTerm.name}</div>
              </div>
            </div>
            <div className="col-4">
              {mode === "comment" ? (
                <div className="card">
                  <div className="card-header">{predicate.pref_label}</div>
                </div>
              ) : (
                <PredicateOptions
                  predicates={predicates}
                  onPredicateSelected={(predicate) => handlePredicateSelected(predicate)}
                  predicate={predicate.pref_label}
                />
              )}
            </div>
            <div className="col-4">
              {alignment.mapped_terms.map((mTerm) => {
                return (
                  <div key={mTerm.id} className="card mb-3">
                    <div className="card-header">{mTerm.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="row mt-3">
            <div className="col form-group">
              {mode === "comment" ? (
                <textarea
                  className="form-control"
                  placeholder="add a comment about this alignment"
                  value={comment || ""}
                  onChange={handleCommentChange}
                />
              ) : (
                comment
              )}
            </div>
          </div>
          <div className="row">
            <div className="col">
              {mode === "comment" ? (
                <button
                  className="btn btn-dark mt-3 mr-3"
                  onClick={handleSaveComment}
                  disabled={!commentChanged}
                >
                  Save Comment
                </button>
              ) : (
                <button
                  className="btn btn-dark mt-3 mr-3"
                  onClick={handleSaveAlignment}
                  disabled={!predicateChanged}
                >
                  Save
                </button>
              )}
              {mode === "comment" ? (
                <a
                  className="btn col-primary cursor-pointer mt-3"
                  onClick={() => setMode("edit")}
                >
                  Edit
                </a>
              ) : (
                <a
                  className="btn col-primary cursor-pointer mt-3"
                  onClick={() => setMode("comment")}
                >
                  Comment
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditAlignment;
